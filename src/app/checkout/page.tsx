"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { createOrder } from "@/lib/api";

export default function Checkout() {
  const { cart, cartTotal, clear } = useStore();
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shipping = cartTotal >= 349 || cartTotal === 0 ? 0 : 49;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    try { const result = await createOrder({ customer: Object.fromEntries(form.entries()), items: cart.map((item) => ({ productId: item.id, quantity: item.quantity, packSize: item.packSize })) }); clear(); setDone(result.orderNumber); }
    catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to place order"); }
    finally { setLoading(false); }
  }
  if (done) return <div className="container py-24 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e2efdf] text-4xl">✓</div><p className="eyebrow mt-7">Thank you for choosing Aroma Roots</p><h1 className="section-heading mt-3">Order received!</h1><p className="mx-auto mt-4 max-w-md text-[#75665d]">Your order <b className="text-[#8f2635]">#{done}</b> is on its way to our kitchen team. We’ll confirm it by phone.</p><Link href={`/order-status?order=${done}`} className="button-primary mt-7 inline-block rounded-full px-6 py-3 font-bold">Track order</Link></div>;
  if (!cart.length) return <div className="container py-24 text-center"><p className="text-5xl">🧺</p><h1 className="section-heading mt-5">Your cart is empty</h1><Link href="/collections/masala-powders" className="button-primary mt-6 inline-block rounded-full px-6 py-3 font-bold">Shop spices</Link></div>;
  const fields = [["name", "Full name"], ["phone", "Phone number"], ["email", "Email (optional)"], ["address", "Address"], ["city", "City"], ["state", "State"], ["pincode", "Pincode"]];
  return <div className="container py-12 md:py-16"><p className="eyebrow">Almost there</p><h1 className="section-heading mt-3">Checkout</h1><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"><form onSubmit={submit} className="border border-[#eadfd2] bg-[#fffdf8] p-5 sm:p-8"><h2 className="serif text-3xl font-bold text-[#8f2635]">Delivery details</h2><p className="mt-2 text-sm text-[#75665d]">We currently confirm orders by phone. No online payment required.</p><div className="mt-7 grid gap-4 sm:grid-cols-2">{fields.map(([name, label]) => <label className={name === "address" ? "sm:col-span-2" : ""} key={name}>{label}<input name={name} required={name !== "email"} type={name === "email" ? "email" : "text"} className="mt-1.5 w-full rounded-lg border border-[#d9c6b2] bg-[#fbf7ef] p-3 focus:border-[#8f2635] focus:outline-none"/></label>)}</div>{error && <p role="alert" className="mt-5 bg-[#fce8e5] p-3 text-sm text-[#8f2635]">{error}</p>}<button disabled={loading} className="button-primary mt-7 w-full rounded-full p-3 font-bold disabled:bg-[#c5b9b0]">{loading ? "Placing order…" : "Place order"}</button></form><aside className="h-fit border border-[#eadfd2] bg-[#fffdf8] p-6"><p className="eyebrow">In your basket</p><h2 className="serif mt-2 text-3xl font-bold text-[#8f2635]">Order summary</h2>{cart.map((item) => <p className="mt-5 flex justify-between gap-4 text-sm" key={`${item.id}-${item.packSize}`}><span>{item.name} × {item.quantity}</span><b>₹{item.price * item.quantity}</b></p>)}<hr className="my-5 border-[#eadfd2]"/><p className="flex justify-between text-[#75665d]">Subtotal <b className="text-[#2e241f]">₹{cartTotal}</b></p><p className="mt-2 flex justify-between text-[#75665d]">Shipping <b className="text-[#2e241f]">{shipping ? "₹49" : "Free"}</b></p><p className="mt-4 flex justify-between text-lg font-bold">Total <b className="text-[#8f2635]">₹{cartTotal + shipping}</b></p></aside></div></div>;
}
