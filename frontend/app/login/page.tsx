"use client";
import { useState } from "react";
import { setToken } from "@/lib/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "login failed");
      setToken(d.token);
      location.href = "/products";
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="card card-pad max-w-md">
      <h1 className="h1 mb-4">Login</h1>
      <input
        className="input mb-3"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input mb-3"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <button className="btn" disabled={loading}>
        {loading ? "..." : "Login"}
      </button>
    </form>
  );
}
