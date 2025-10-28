"use client";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: any) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const d = await r.json();
    if (!r.ok) setErr(d?.error || "failed");
    else setMsg("Registered! Go to Login.");
  }

  return (
    <form onSubmit={onSubmit} className="card card-pad max-w-md">
      <h1 className="h1 mb-4">Register</h1>
      <input
        className="input mb-3"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      {msg && <p className="text-green-700 mb-2">{msg}</p>}
      <button className="btn">Create account</button>
    </form>
  );
}
