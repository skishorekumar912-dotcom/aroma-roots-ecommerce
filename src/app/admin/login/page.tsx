"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to sign in");
      localStorage.setItem("ar-admin-token", body.token); router.push("/admin");
    } catch (loginError) { setError(loginError instanceof Error ? loginError.message : "Unable to sign in"); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen bg-[#f2e4d2] px-5 py-24"><form onSubmit={submit} className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-soft"><p className="font-bold uppercase tracking-widest text-[#d96b27]">Aroma Roots</p><h1 className="serif mt-2 text-4xl font-bold text-[#7d1f2b]">Admin sign in</h1><label className="mt-8 block">Email<input name="email" type="email" required className="mt-1 w-full rounded-lg border p-3"/></label><label className="mt-4 block">Password<input name="password" type="password" required className="mt-1 w-full rounded-lg border p-3"/></label>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-full bg-[#7d1f2b] p-3 font-bold text-white">{loading?"Signing in…":"Sign in"}</button></form></main>;
}
