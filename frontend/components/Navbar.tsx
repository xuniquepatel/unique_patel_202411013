"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchMe, clearToken } from "@/lib/auth";

export default function Navbar() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then((u) => setName(u?.name ?? null))
      .catch(() => setName(null));
  }, []);

  function logout() {
    clearToken();
    location.href = "/login";
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/orders">Orders</Link>
      {name ? (
        <span style={{ marginLeft: "auto" }}>
          Signed in as <b>{name}</b>{" "}
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Logout
          </button>
        </span>
      ) : (
        <span style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </span>
      )}
    </nav>
  );
}
