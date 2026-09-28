import CollectionBrowser from "@/components/CollectionBrowser";
import Link from "next/link";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function Collection({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replaceAll("-", " ");
  const products = await getProducts();
  const shown = products.filter((product) => product.category.toLowerCase().replaceAll(" ", "-") === category || product.name.toLowerCase().includes(title));
  return <div className="container py-12 md:py-16"><div className="flex items-center gap-2 text-sm text-[#75665d]"><Link href="/" className="hover:text-[#8f2635]">Home</Link><span>/</span><span className="capitalize">{title}</span></div><p className="eyebrow mt-10">The Aroma Roots pantry</p><h1 className="section-heading mt-3 capitalize">{title}</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-[#75665d]">Thoughtfully blended pantry staples made for deeply satisfying Indian meals.</p><CollectionBrowser products={shown.length ? shown : products} title={title}/></div>;
}
