"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { cart, cartTotal } = useStore();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const closeMenu = () => setOpen(false);
  return <>
    <div className="bg-[#641b28] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[.12em] text-white">
      Free delivery above ₹349 <span className="mx-2 text-[#f3c98e]">·</span> Small-batch spices, packed fresh
    </div>
    <header className="sticky top-0 z-40 border-b border-[#eadfd2]/80 bg-[#fbf7ef]/95 backdrop-blur-md">
      <div className="container flex min-h-[74px] items-center justify-between gap-4">
        <button aria-label={open ? "Close menu" : "Open menu"} className="rounded-lg p-2 text-2xl md:hidden" onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
        <Link href="/" className="shrink-0 text-[#8f2635]" onClick={closeMenu}>
          <span className="serif text-[1.35rem] font-bold tracking-[.12em]">AROMA <span className="text-[#d6842d]">ROOTS</span></span>
          <span className="block text-[8px] font-bold tracking-[.31em] text-[#75665d]">AUTHENTIC SPICES</span>
        </Link>
        <nav className={`${open ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-1 border-b border-[#eadfd2] bg-[#fbf7ef] p-4 shadow-soft md:static md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#f3dfc5]" onClick={closeMenu}>Home</Link>
          <Link href="/collections/masala-powders" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#f3dfc5]" onClick={closeMenu}>Shop</Link>
          <Link href="/collections/spice-blends" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#f3dfc5]" onClick={closeMenu}>Categories</Link>
          <Link href="/recipes" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#f3dfc5]" onClick={closeMenu}>Recipes</Link>
          <Link href="/pages/about" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#f3dfc5]" onClick={closeMenu}>Our story</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <Link aria-label="Search" href="/search" className="rounded-full p-2 text-xl hover:bg-[#f3dfc5]">⌕</Link>
          <Link aria-label="Wishlist" href="/wishlist" className="hidden rounded-full p-2 text-xl hover:bg-[#f3dfc5] sm:block">♡</Link>
          <button aria-label={`Open cart with ${itemCount} items`} onClick={() => setDrawer(true)} className="relative rounded-full p-2 text-xl hover:bg-[#f3dfc5]">
            🛒
            {itemCount > 0 && <sup className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#d6842d] px-1 text-[10px] font-bold text-white">{itemCount}</sup>}
          </button>
        </div>
      </div>
    </header>
    {drawer && <div className="fixed inset-0 z-50 bg-[#2e241f]/45" onClick={() => setDrawer(false)}>
      <aside aria-label="Shopping cart" className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fffdf8] p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-[#eadfd2] pb-5"><div><p className="eyebrow">Your basket</p><h2 className="serif mt-1 text-3xl font-bold text-[#8f2635]">Ready to cook?</h2></div><button aria-label="Close cart" className="rounded-full border border-[#eadfd2] px-3 py-1 text-xl" onClick={() => setDrawer(false)}>×</button></div>
        {cart.length ? <><div className="flex-1 overflow-y-auto">{cart.map((item) => <div className="flex justify-between gap-4 border-b border-[#eadfd2] py-5" key={`${item.id}-${item.packSize}`}><div><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#75665d]">{item.packSize} · Qty {item.quantity}</p></div><b className="whitespace-nowrap text-[#8f2635]">₹{item.price * item.quantity}</b></div>)}</div><div className="border-t border-[#eadfd2] pt-5"><p className="flex justify-between font-bold">Subtotal <span>₹{cartTotal}</span></p><Link className="button-primary mt-5 block rounded-full p-3 text-center font-bold" href="/cart" onClick={() => setDrawer(false)}>View basket & checkout</Link></div></> : <div className="flex flex-1 items-center justify-center text-center"><div><div className="text-5xl">🌶️</div><p className="mt-4 font-bold">Your basket is waiting.</p><Link href="/collections/masala-powders" className="button-secondary mt-5 inline-block rounded-full px-5 py-2 font-bold" onClick={() => setDrawer(false)}>Shop spices</Link></div></div>}
      </aside>
    </div>}
  </>;
}
