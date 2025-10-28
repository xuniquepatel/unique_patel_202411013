"use client";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/auth";

type Me = { id: number; name: string; email: string; role: string };

export default function NavbarClient() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setMe(null);
      return;
    }
    fetch(process.env.NEXT_PUBLIC_API_BASE + "/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => (r.ok ? (r.json() as Promise<Me>) : Promise.resolve(null)))
      .then((d) => setMe(d))
      .catch(() => setMe(null));
  }, []);

  return (
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
          <a className="link" href="/login">
            Login
          </a>
          <a className="link" href="/register">
            Register
          </a>
        </>
      )}
    </div>
  );
}
