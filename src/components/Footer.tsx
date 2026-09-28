import Link from "next/link";

export default function Footer() {
  return <footer className="mt-20 bg-[#2e241f] text-[#fffdf8]">
    <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
      <div><p className="serif text-3xl font-bold tracking-[.08em] text-[#f3c98e]">AROMA ROOTS</p><p className="mt-3 max-w-xs text-sm leading-6 text-[#d8c4b3]">Authentic Spices. Effortless Cooking. Thoughtfully blended for everyday Indian kitchens.</p><div className="mt-5 flex gap-2"><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-[#d8c4b3]">Small batch</span><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-[#d8c4b3]">FSSAI compliant</span></div></div>
      <div><h3 className="font-bold text-[#f3c98e]">Shop</h3><div className="mt-4 grid gap-3 text-sm text-[#d8c4b3]"><Link href="/collections/masala-powders">Masalas</Link><Link href="/collections/spice-blends">Spice blends</Link><Link href="/combos">Combos</Link><Link href="/recipes">Recipes</Link></div></div>
      <div><h3 className="font-bold text-[#f3c98e]">Help</h3><div className="mt-4 grid gap-3 text-sm text-[#d8c4b3]"><Link href="/pages/faq">FAQs</Link><Link href="/pages/contact">Contact us</Link><Link href="/order-status">Track order</Link><Link href="/pages/shipping">Shipping & returns</Link></div></div>
      <div><h3 className="font-bold text-[#f3c98e]">Join the spice circle</h3><p className="mt-3 text-sm leading-6 text-[#d8c4b3]">Recipes, new blends and 10% off your first order.</p><div className="mt-4 flex"><input aria-label="Email address" className="min-w-0 flex-1 rounded-l-full border-0 bg-white p-3 text-sm text-[#2e241f]" placeholder="Your email" type="email"/><button className="rounded-r-full bg-[#d6842d] px-4 font-bold">Join</button></div></div>
    </div>
    <div className="border-t border-white/10"><div className="container flex flex-col gap-2 py-5 text-xs text-[#bda99b] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Aroma Roots · Made for Indian kitchens</span><span>Privacy · Terms · Secure checkout</span></div></div>
  </footer>;
}
