import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await getProducts();
  const query = q.trim();
  const result = products.filter((product) => `${product.name} ${product.category} ${product.dishTypes.join(" ")} ${product.region}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="container py-12 md:py-16"><p className="eyebrow">Find your flavour</p><h1 className="section-heading mt-3">Search the pantry</h1><form className="mt-8 flex max-w-3xl gap-2" action="/search"><label className="sr-only" htmlFor="search">Search spices</label><input id="search" name="q" defaultValue={query} placeholder="Try chicken, biryani, podi…" className="min-w-0 flex-1 rounded-full border border-[#d9c6b2] bg-[#fffdf8] px-5 py-3 focus:border-[#8f2635] focus:outline-none"/><button className="button-primary rounded-full px-6 py-3 font-bold">Search</button></form><div className="mt-7 flex flex-wrap gap-2">{["Chicken", "Biryani", "Podi", "Sambar", "Rasam", "Pickle"].map((item) => <Link href={`/search?q=${item}`} className="rounded-full border border-[#eadfd2] bg-[#fffdf8] px-4 py-2 text-sm font-semibold hover:border-[#8f2635] hover:text-[#8f2635]" key={item}>{item}</Link>)}</div><div className="mt-12 flex items-baseline justify-between border-b border-[#eadfd2] pb-4"><p className="text-sm text-[#75665d]"><b className="text-[#2e241f]">{result.length}</b> {result.length === 1 ? "result" : "results"}{query && <> for <span className="font-semibold text-[#8f2635]">“{query}”</span></>}</p></div>{result.length ? <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">{result.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="py-24 text-center"><p className="text-5xl">🔎</p><h2 className="serif mt-5 text-3xl font-bold text-[#8f2635]">No spices found</h2><p className="mt-2 text-[#75665d]">Try a broader search or explore our bestsellers.</p><Link href="/collections/masala-powders" className="button-primary mt-6 inline-block rounded-full px-6 py-3 font-bold">Browse all spices</Link></div>}</div>;
}
