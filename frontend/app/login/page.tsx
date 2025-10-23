"use client";
import { useState } from "react";
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function onSubmit(e: any) {
    e.preventDefault();
    const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    localStorage.setItem("token", d.token || "");
    location.href = "/products";
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
      />
      <button>Login</button>
    </form>
  );
}
