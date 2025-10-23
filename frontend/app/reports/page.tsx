"use client";

import { useEffect, useState } from "react";

type RevenueRow = { date: string; total: number };
type CategoryRow = { category: string; count: number; sumPrice?: number };

export default function ReportsPage() {
  const [rev, setRev] = useState<RevenueRow[] | null>(null);
  const [cats, setCats] = useState<CategoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    const token =
      (typeof window !== "undefined" && localStorage.getItem("token")) || "";
    if (!token) {
      setError("Please log in as admin to view reports.");
      setLoading(false);
      return;
    }

    const h = { Authorization: "Bearer " + token };

    Promise.all([
      fetch(`${API}/reports/sql/daily-revenue`, { headers: h }).then(
        async (r) => {
          if (!r.ok) throw new Error(`SQL report ${r.status}`);
          const ct = r.headers.get("content-type") || "";
          if (!ct.includes("application/json"))
            throw new Error("SQL report returned non-JSON");
          return r.json();
        }
      ),
      fetch(`${API}/reports/mongo/category`, { headers: h }).then(async (r) => {
        if (!r.ok) throw new Error(`Mongo report ${r.status}`);
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json"))
          throw new Error("Mongo report returned non-JSON");
        return r.json();
      }),
    ])
      .then(([a, b]) => {
        setRev(a);
        setCats(b);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main>
        <h1>Reports</h1>
        <p>Loading…</p>
      </main>
    );
  if (error)
    return (
      <main>
        <h1>Reports</h1>
        <p style={{ color: "crimson" }}>{error}</p>
      </main>
    );

  return (
    <main>
      <h1>Reports</h1>
      <h2>Daily Revenue (SQL)</h2>
      <pre>{JSON.stringify(rev, null, 2)}</pre>

      <h2>By Category (Mongo)</h2>
      <pre>{JSON.stringify(cats, null, 2)}</pre>
    </main>
  );
}
