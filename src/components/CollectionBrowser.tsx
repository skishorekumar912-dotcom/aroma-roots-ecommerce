"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

type Props = { products: Product[]; title: string };
const spice = ["Mild", "Medium", "Hot"];

export default function CollectionBrowser({ products, title }: Props) {
  const [filters, setFilters] = useState({ price: 1000, spice: "", dish: "", pack: "", veg: "", region: "" });
  const [sort, setSort] = useState("featured");
  const [mobile, setMobile] = useState(false);
  const dishes = Array.from(new Set(products.flatMap((product) => product.dishTypes))).sort();
  const packs = Array.from(new Set(products.flatMap((product) => product.packSizes))).sort();
  const regions = Array.from(new Set(products.map((product) => product.region).filter(Boolean))).sort();
  const maximumPrice = Math.max(1000, ...products.map((product) => product.price));
  const filtered = useMemo(() => {
    const list = products.filter((product) => product.price <= filters.price && (!filters.spice || product.spiceLevel.toLowerCase() === filters.spice.toLowerCase()) && (!filters.dish || product.dishTypes.includes(filters.dish)) && (!filters.pack || product.packSizes.includes(filters.pack)) && (!filters.veg || (filters.veg === "veg" ? product.veg : !product.veg)) && (!filters.region || product.region === filters.region));
    return [...list].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : sort === "newest" ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id));
  }, [filters, sort, products]);
  const set = (key: string, value: string | number) => setFilters((current) => ({ ...current, [key]: value }));
  const controls = <div className="grid gap-5 text-sm">
    <label className="font-semibold">Price up to ₹{filters.price}<input aria-label="Maximum price" type="range" min="0" max={maximumPrice} value={Math.min(filters.price, maximumPrice)} onChange={(event) => set("price", Number(event.target.value))} className="mt-3 w-full accent-[#8f2635]"/></label>
    <label>Spice level<select value={filters.spice} onChange={(event) => set("spice", event.target.value)} className="mt-2 w-full rounded-lg border border-[#eadfd2] bg-[#fffdf8] p-2.5"><option value="">All levels</option>{spice.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Dish type<select value={filters.dish} onChange={(event) => set("dish", event.target.value)} className="mt-2 w-full rounded-lg border border-[#eadfd2] bg-[#fffdf8] p-2.5"><option value="">All dishes</option>{dishes.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Pack size<select value={filters.pack} onChange={(event) => set("pack", event.target.value)} className="mt-2 w-full rounded-lg border border-[#eadfd2] bg-[#fffdf8] p-2.5"><option value="">All sizes</option>{packs.map((item) => <option key={item}>{item}</option>)}</select></label>
    <fieldset><legend className="font-semibold">Diet</legend><div className="mt-2 grid gap-2"><label><input type="radio" name={`diet-${title}`} checked={filters.veg === "veg"} onChange={() => set("veg", "veg")} className="mr-2 accent-[#8f2635]"/>Vegetarian</label><label><input type="radio" name={`diet-${title}`} checked={filters.veg === "nonveg"} onChange={() => set("veg", "nonveg")} className="mr-2 accent-[#8f2635]"/>Non-vegetarian</label></div></fieldset>
    <label>Region<select value={filters.region} onChange={(event) => set("region", event.target.value)} className="mt-2 w-full rounded-lg border border-[#eadfd2] bg-[#fffdf8] p-2.5"><option value="">All regions</option>{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
    <button className="text-left font-semibold text-[#8f2635] underline underline-offset-4" onClick={() => setFilters({ price: maximumPrice, spice: "", dish: "", pack: "", veg: "", region: "" })}>Clear all filters</button>
  </div>;
  return <><div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-y border-[#eadfd2] py-4"><span className="text-sm text-[#75665d]"><b className="text-[#2e241f]">{filtered.length}</b> products in {title}</span><div className="flex gap-2"><button className="rounded-full border border-[#8f2635] px-4 py-2 text-sm font-semibold text-[#8f2635] md:hidden" onClick={() => setMobile(true)}>Filter products</button><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-[#eadfd2] bg-[#fffdf8] px-4 py-2 text-sm"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top rated</option><option value="newest">Newest</option></select></div></div><div className="mt-8 grid gap-8 md:grid-cols-[230px_1fr]"><aside className="hidden h-fit border border-[#eadfd2] bg-[#fffdf8] p-5 md:block"><p className="eyebrow">Refine</p><h2 className="serif mb-5 mt-2 text-2xl font-bold text-[#8f2635]">Filter by</h2>{controls}</aside><div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">{filtered.length ? filtered.map((product) => <ProductCard key={product.id} product={product}/>) : <div className="col-span-full py-20 text-center"><p className="text-4xl">🌶️</p><p className="mt-4 font-bold">No products match those filters.</p><p className="mt-1 text-sm text-[#75665d]">Try widening your search.</p></div>}</div></div>{mobile && <div className="fixed inset-0 z-50 bg-[#2e241f]/45" onClick={() => setMobile(false)}><aside className="ml-auto h-full w-[min(90%,380px)] overflow-y-auto bg-[#fffdf8] p-6" onClick={(event) => event.stopPropagation()}><div className="mb-7 flex items-center justify-between"><div><p className="eyebrow">Refine</p><h2 className="serif mt-1 text-2xl font-bold text-[#8f2635]">Filter products</h2></div><button aria-label="Close filters" onClick={() => setMobile(false)} className="rounded-full border px-3 py-1 text-xl">×</button></div>{controls}<button className="button-primary mt-8 w-full rounded-full p-3 font-bold" onClick={() => setMobile(false)}>Show {filtered.length} products</button></aside></div>}</>;
}
