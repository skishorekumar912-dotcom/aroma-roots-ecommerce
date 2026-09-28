"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type Summary = { products: { total: number; active: number; low_stock: number }; orders: { total: number; pending: number; delivered: number }; enquiries: { total: number } };
export default function AdminDashboard() {
  const router = useRouter(); const [summary, setSummary] = useState<Summary | null>(null); const [error, setError] = useState("");
  useEffect(() => { const token = localStorage.getItem("ar-admin-token"); if (!token) { router.push("/admin/login"); return; } fetch(`${API_URL}/api/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => { if (!response.ok) throw new Error("Session expired"); return response.json(); }).then(setSummary).catch(() => { localStorage.removeItem("ar-admin-token"); setError("Unable to load dashboard"); }); }, [router]);
  if (error) return <main className="container py-20"><p role="alert" className="text-red-700">{error}</p><Link href="/admin/login" className="mt-4 inline-block underline">Sign in again</Link></main>;
  return <main className="container py-12"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-bold uppercase tracking-widest text-[#d96b27]">Aroma Roots</p><h1 className="serif mt-2 text-5xl font-bold text-[#7d1f2b]">Admin dashboard</h1></div><button onClick={() => { localStorage.removeItem("ar-admin-token"); router.push("/admin/login"); }} className="rounded-full border px-5 py-2">Log out</button></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Products",summary?.products.total],["Active products",summary?.products.active],["Low stock",summary?.products.low_stock],["Orders",summary?.orders.total],["Pending orders",summary?.orders.pending],["Delivered",summary?.orders.delivered],["Open enquiries",summary?.enquiries.total]].map(([label,value])=><div className="rounded-2xl bg-white p-5 shadow-soft" key={String(label)}><p className="text-sm text-gray-500">{label}</p><b className="mt-2 block text-3xl text-[#7d1f2b]">{value ?? "…"}</b></div>)}</div><nav className="mt-10 grid gap-4 sm:grid-cols-2"><Link href="/admin/products" className="rounded-2xl bg-[#7d1f2b] p-5 font-bold text-white">Manage products →</Link><Link href="/admin/orders" className="rounded-2xl bg-white p-5 font-bold text-[#7d1f2b]">Manage orders →</Link></nav></main>;
}
