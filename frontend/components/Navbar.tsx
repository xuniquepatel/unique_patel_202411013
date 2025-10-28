"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken } from "@/lib/auth";

type Me = { id: number; name: string; email: string; role: string };

export default function Navbar() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    if (!token) {
      setMe(null);
      return;
    }

    fetch(process.env.NEXT_PUBLIC_API_BASE + "/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((u: Me | null) => setMe(u))
      .catch(() => setMe(null));
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="link" href="/">
          Home
        </Link>
        <Link className="link" href="/products">
          Products
        </Link>
        <Link className="link" href="/cart">
          Cart
        </Link>
        <Link className="link" href="/reports">
          Reports
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {me ? (
            <>
              <span className="muted">Hi, {me.name}</span>
              <button
                className="btn-outline"
                onClick={() => {
                  clearToken();
                  location.href = "/";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="link" href="/login">
                Login
              </Link>
              <Link className="link" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
