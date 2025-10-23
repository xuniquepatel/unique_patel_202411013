"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>(null);
  async function refresh() {
    const r = await fetch(
      process.env.NEXT_PUBLIC_API_BASE + "/checkout/preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
        body: JSON.stringify({ items }),
      }
    );
    setPreview(await r.json());
  }
  useEffect(() => {
    refresh();
  }, [items]);
  async function place() {
    const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
      body: JSON.stringify({ items }),
    });
    const d = await r.json();
    alert("Order " + d.orderId);
  }
  return (
    <main>
      <button onClick={() => setItems([{ productId: "p1", quantity: 1 }])}>
        Add P1
      </button>
      <button onClick={() => setItems([{ productId: "p2", quantity: 2 }])}>
        Add P2x2
      </button>
      <pre>{JSON.stringify(preview, null, 2)}</pre>
      <button onClick={place}>Checkout</button>
    </main>
  );
}
