"use client";
import { useEffect, useState } from "react";
import { readCart, setQty, clearCart } from "@/lib/cart";
import { getToken } from "@/lib/auth";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  function refreshLocal() {
    setItems(readCart());
  }
  async function refreshPreview() {
    setErr(null);
    setPreview(null);
    const token = getToken();
    if (!token) {
      setErr("Login required to preview totals.");
      return;
    }
    const r = await fetch(
      process.env.NEXT_PUBLIC_API_BASE + "/checkout/preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ items }),
      }
    );
    const d = await r.json();
    if (!r.ok) setErr(d?.error || "preview failed");
    else setPreview(d);
  }
  async function place() {
    setPlacing(true);
    setErr(null);
    const token = getToken();
    if (!token) {
      setErr("Login required");
      setPlacing(false);
      return;
    }
    const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ items }),
    });
    const d = await r.json();
    if (!r.ok) setErr(d?.error || "checkout failed");
    else {
      alert("Order " + d.orderId);
      clearCart();
      refreshLocal();
      setPreview(null);
    }
    setPlacing(false);
  }

  useEffect(() => {
    refreshLocal();
  }, []);
  useEffect(() => {
    if (items.length) void refreshPreview();
  }, [items]);

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="card card-pad">
        <h1 className="h1 mb-4">Cart</h1>
        {!items.length && (
          <p className="muted">Your cart is empty. Add items from Products.</p>
        )}
        {items.map((it) => (
          <div
            key={it.productId}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div>
              <div className="font-medium">{it.productId}</div>
              <div className="muted text-sm">
                Edit quantity to update preview
              </div>
            </div>
            <input
              type="number"
              min={1}
              className="input w-24"
              value={it.quantity}
              onChange={(e) => {
                setQty(it.productId, Number(e.target.value));
                refreshLocal();
              }}
            />
          </div>
        ))}
        <div className="mt-4 flex gap-3">
          <a className="btn-outline" href="/products">
            Continue shopping
          </a>
          <button
            className="btn-outline"
            onClick={() => {
              clearCart();
              refreshLocal();
            }}
          >
            Clear cart
          </button>
        </div>
      </div>

      <div className="card card-pad">
        <h2 className="h2 mb-4">Order Preview</h2>
        {err && (
          <p className="text-red-600 mb-3">
            {err}{" "}
            {err.includes("Login") && (
              <a className="link underline" href="/login">
                Login
              </a>
            )}
          </p>
        )}
        {preview ? (
          <>
            <div className="space-y-2">
              {preview.items.map((x: any) => (
                <div key={x.productId} className="flex justify-between">
                  <span>
                    {x.name} × {x.quantity}
                  </span>
                  <span>₹{x.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{preview.total}</span>
            </div>
            <button className="btn mt-4" disabled={placing} onClick={place}>
              {placing ? "Placing…" : "Checkout"}
            </button>
          </>
        ) : (
          <p className="muted">Edit quantities, then preview totals.</p>
        )}
      </div>
    </section>
  );
}
