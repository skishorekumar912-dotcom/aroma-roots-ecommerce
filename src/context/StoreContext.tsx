"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";
type Store = { cart:CartItem[]; wishlist:string[]; add:(p:Product, packSize?:string)=>void; change:(id:string,n:number,packSize?:string)=>void; remove:(id:string,packSize?:string)=>void; clear:()=>void; toggleWish:(id:string)=>void; cartTotal:number };
const Context=createContext<Store|null>(null);
function readSaved<T>(key:string, fallback:T):T {
 if(typeof window==="undefined")return fallback;
 try { const value:unknown=JSON.parse(localStorage.getItem(key)||"null"); return value === null ? fallback : value as T; }
 catch { console.error(`Unable to restore ${key}.`); return fallback; }
}
export function StoreProvider({children}:{children:React.ReactNode}) {
 const [cart,setCart]=useState<CartItem[]>(()=>readSaved("ar-cart",[]));
 const [wishlist,setWishlist]=useState<string[]>(()=>readSaved("ar-wishlist",[]));
 useEffect(()=>{localStorage.setItem("ar-cart",JSON.stringify(cart));},[cart]); useEffect(()=>{localStorage.setItem("ar-wishlist",JSON.stringify(wishlist));},[wishlist]);
 const add=(p:Product,packSize=p.packSizes[0] || "Standard")=>setCart(c=>{const i=c.findIndex(x=>x.id===p.id&&x.packSize===packSize);if(i>-1)return c.map((x,j)=>j===i?{...x,quantity:x.quantity+1}:x);return [...c,{...p,packSize,quantity:1}]});
 const change=(id:string,n:number,packSize?:string)=>setCart(c=>c.map(x=>x.id===id&&(packSize===undefined||x.packSize===packSize)?{...x,quantity:Math.max(1,n)}:x)); const remove=(id:string,packSize?:string)=>setCart(c=>c.filter(x=>x.id!==id||packSize!==undefined&&x.packSize!==packSize)); const toggleWish=(id:string)=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 return <Context.Provider value={{cart,wishlist,add,change,remove,clear:()=>setCart([]),toggleWish,cartTotal:cart.reduce((s,x)=>s+x.price*x.quantity,0)}}>{children}</Context.Provider>
}
export const useStore=()=>{const c=useContext(Context);if(!c)throw new Error("useStore must be used within StoreProvider");return c};
