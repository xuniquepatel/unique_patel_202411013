"use client";
import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function ProductListClient({ items }: { items: any[] }) {
  const [toast, setToast] = useState<string>("");
  function pushToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p._id} className="card card-pad">
            <div className="h2">{p.name}</div>
            <div className="muted text-sm">
              {p.sku} · {p.category}
            </div>
            <div className="mt-3 text-2xl">₹{p.price}</div>
            <button
              className="btn mt-4"
              onClick={() => {
                addToCart(String(p._id), 1);
                pushToast(`${p.name} added`);
              }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
