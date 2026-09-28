"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  const discount = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const unavailable = product.isActive === false || product.stockQuantity === 0;
  return <article className="group flex h-full flex-col overflow-hidden border border-[#eadfd2] bg-[#fffdf8] shadow-[0_10px_28px_rgba(74,42,22,.05)] transition hover:-translate-y-1 hover:shadow-soft">
    <div className="relative aspect-[4/4.2] overflow-hidden bg-[#f3e5d3]">
      <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105"/>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">{product.badge && <span className="bg-[#8f2635] px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-white">{product.badge}</span>}<button aria-label={wishlist.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => toggleWish(product.id)} className="ml-auto rounded-full bg-[#fffdf8]/95 px-2 py-1 text-xl text-[#8f2635]">{wishlist.includes(product.id) ? "♥" : "♡"}</button></div>
      {unavailable && <div className="absolute inset-x-0 bottom-0 bg-[#2e241f]/80 px-3 py-2 text-center text-xs font-bold text-white">{product.stockQuantity === 0 ? "Currently out of stock" : "Unavailable"}</div>}
    </div>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#d6842d]">{product.category}</p>
      <Link href={`/products/${product.slug}`} className="mt-2 line-clamp-2 min-h-[3rem] font-bold leading-6 hover:text-[#8f2635]">{product.name}</Link>
      <p className="mt-2 text-sm text-[#d6842d]">★ {product.rating.toFixed(1)} <span className="text-[#9d8e84]">({product.reviewCount})</span></p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2"><b className="text-lg text-[#2e241f]">₹{product.price}</b>{product.mrp > product.price && <><del className="text-sm text-[#9d8e84]">₹{product.mrp}</del><span className="text-[11px] font-bold text-[#477354]">{discount}% off</span></>}</div>
      <p className="mt-1 text-xs text-[#75665d]">{product.packSizes.join(" · ")}</p>
      <button disabled={unavailable} onClick={() => add(product)} className="button-primary mt-5 w-full rounded-full py-2.5 text-sm font-bold disabled:bg-[#c5b9b0]">{unavailable ? "Out of stock" : "Add to basket"}</button>
    </div>
  </article>;
}
