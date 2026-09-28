import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";
const dishes = ["Biryani", "Fried Rice", "Sambar", "Rasam", "Chicken", "Mutton", "Fish", "Idli & Dosa"];
const categoryArt = ["🌶️", "✨", "🥥", "🥜", "🥭", "🫚", "🍚", "🎁"];

export default async function Home() {
  const [products, categoriesFromApi] = await Promise.all([getProducts(), getCategories()]);
  const categories = categoriesFromApi.length ? categoriesFromApi.map((category) => category.name) : ["Masala Powders", "Spice Blends", "Curry Pastes", "Podis", "Pickles", "Pure Spices", "Recipe Kits", "Combos"];
  return <>
    <section className="pattern">
      <div className="container grid items-center gap-10 py-14 md:grid-cols-[.9fr_1.1fr] md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">Authentic spices. Effortless cooking.</p>
          <h1 className="serif mt-5 text-5xl font-bold leading-[1.05] text-[#8f2635] sm:text-6xl md:text-[4.65rem]">Bring the soul of Indian kitchens home.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#75665d]">Small-batch masalas, regional blends and recipe kits that turn everyday ingredients into food worth gathering around.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/collections/masala-powders" className="button-primary rounded-full px-6 py-3 font-bold">Shop bestsellers</Link><Link href="/recipes" className="button-secondary rounded-full px-6 py-3 font-bold">Cook with us</Link></div>
          <div className="mt-10 flex flex-wrap gap-5 border-t border-[#d9c6b2] pt-5 text-sm font-semibold text-[#75665d]"><span>✓ No artificial colours</span><span>✓ Packed fresh</span><span>✓ Regional recipes</span></div>
        </div>
        <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#d7b28b] shadow-soft md:min-h-[540px]">
          <Image src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85" alt="Colourful Indian spices arranged in bowls" fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover"/>
          <div className="absolute bottom-5 left-5 max-w-[230px] bg-[#fffdf8]/95 p-4"><p className="eyebrow">From our pantry</p><p className="serif mt-1 text-xl font-bold text-[#8f2635]">Flavour with a story.</p></div>
        </div>
      </div>
    </section>

    <section className="container py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Explore the pantry</p><h2 className="section-heading mt-3">Find your everyday flavour</h2></div><Link href="/collections/masala-powders" className="font-bold text-[#8f2635] underline decoration-[#d6842d] underline-offset-4">View all categories →</Link></div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">{categories.map((category, index) => <Link href={`/collections/${category.toLowerCase().replaceAll(" ", "-")}`} key={category} className="group border border-[#eadfd2] bg-[#fffdf8] p-5 transition hover:-translate-y-1 hover:border-[#d6842d] hover:shadow-soft"><span className="text-4xl">{categoryArt[index % categoryArt.length]}</span><h3 className="mt-5 font-bold text-[#2e241f] group-hover:text-[#8f2635]">{category}</h3><p className="mt-1 text-sm text-[#75665d]">Explore the range</p></Link>)}</div>
    </section>

    <section className="bg-[#f3e5d3] py-16 md:py-20"><div className="container"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Loved by home cooks</p><h2 className="section-heading mt-3">Bestsellers</h2></div><Link href="/collections/masala-powders" className="font-bold text-[#8f2635] underline decoration-[#d6842d] underline-offset-4">Shop all →</Link></div><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product}/>)}</div></div></section>

    <section className="container py-16 md:py-24"><div className="grid items-center gap-10 md:grid-cols-[1fr_1.15fr]"><div><p className="eyebrow">Made for the way you cook</p><h2 className="section-heading mt-3">What’s on the menu?</h2><p className="mt-5 max-w-md text-[#75665d]">Choose a dish, discover its signature blend and get dinner moving without the guesswork.</p><div className="mt-7 flex flex-wrap gap-2">{dishes.map((dish) => <Link href={`/search?q=${dish}`} key={dish} className="rounded-full border border-[#d9c6b2] bg-[#fffdf8] px-4 py-2 text-sm font-semibold transition hover:border-[#8f2635] hover:text-[#8f2635]">{dish}</Link>)}</div></div><div className="relative min-h-[300px] overflow-hidden bg-[#8f2635] p-8 text-white md:min-h-[360px] md:p-12"><div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-[#f3c98e]/40"/><p className="eyebrow text-[#f3c98e]">Why Aroma Roots?</p><h2 className="serif mt-4 max-w-md text-4xl font-bold leading-tight">Big flavour, thoughtfully made.</h2><p className="mt-5 max-w-md text-[#f5dfca]">Authentic regional blends, quality ingredients and simple recipe guidance for meals that feel like home.</p><Link href="/pages/about" className="mt-8 inline-block border-b border-[#f3c98e] pb-1 font-bold text-[#f3c98e]">Our approach →</Link></div></div></section>

    <section className="border-y border-[#eadfd2] bg-[#fffdf8] py-14"><div className="container grid gap-8 text-center sm:grid-cols-3"><div><span className="text-3xl">🌿</span><h3 className="mt-3 font-bold">Clean ingredients</h3><p className="mt-1 text-sm text-[#75665d]">Nothing unnecessary, just good spice.</p></div><div><span className="text-3xl">🧺</span><h3 className="mt-3 font-bold">Packed with care</h3><p className="mt-1 text-sm text-[#75665d]">Freshness sealed into every pouch.</p></div><div><span className="text-3xl">🍲</span><h3 className="mt-3 font-bold">Recipes that work</h3><p className="mt-1 text-sm text-[#75665d]">Real guidance for real kitchens.</p></div></div></section>

    <section className="bg-[#f3e5d3] py-14"><div className="container text-center"><p className="eyebrow">A little extra flavour</p><h2 className="section-heading mt-3">Get 10% off your first order</h2><p className="mx-auto mt-3 max-w-lg text-[#75665d]">Join our spice-loving community for recipes, seasonal launches and kitchen inspiration.</p><div className="mx-auto mt-7 flex max-w-md"><input aria-label="Email address" className="min-w-0 flex-1 rounded-l-full border border-r-0 border-[#d9c6b2] bg-[#fffdf8] p-3" placeholder="Email address" type="email"/><button className="rounded-r-full bg-[#d6842d] px-5 font-bold text-white">Subscribe</button></div></div></section>
  </>;
}
