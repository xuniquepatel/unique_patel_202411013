"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";

type Order = { orderId: number; total: number; createdAt: string };

export default function OrdersPage() {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastOrder");
    if (raw) setLastOrder(JSON.parse(raw));
  }, []);

  return (
    <Protected>
      <main style={{ padding: 24 }}>
        <h1>Orders</h1>
        {!lastOrder ? (
          <p>No recent orders found.</p>
        ) : (
          <div style={{ marginTop: 12 }}>
            <div>Order ID: {lastOrder.orderId}</div>
            <div>Total: ₹{lastOrder.total}</div>
            <div>Placed: {new Date(lastOrder.createdAt).toLocaleString()}</div>
          </div>
        )}
      </main>
    </Protected>
  );
}
