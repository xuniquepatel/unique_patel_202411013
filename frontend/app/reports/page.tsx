"use client";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

type RevenueRow = { date: string; total: number };
type CategoryRow = { category: string; count: number; sumPrice?: number };

function toArray<T>(x: any): T[] {
  if (Array.isArray(x)) return x;
  if (Array.isArray(x?.rows)) return x.rows;
  if (Array.isArray(x?.data)) return x.data;
  if (Array.isArray(x?.result)) return x.result;
  if (Array.isArray(x?.items)) return x.items;
  return [];
}

export default function ReportsPage() {
  const [rev, setRev] = useState<RevenueRow[] | null>(null);
  const [cats, setCats] = useState<CategoryRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setErr("Login as admin to view reports");
      setLoading(false);
      return;
    }

    const h = { Authorization: "Bearer " + token };

    const fetchJSON = async (url: string) => {
      const r = await fetch(url, { headers: h });
      if (!r.ok) {
        const text = await r.text().catch(() => "");
        throw new Error(`${url} -> ${r.status} ${text.slice(0, 160)}`);
      }
      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await r.text().catch(() => "");
        throw new Error(`${url} returned non-JSON: ${text.slice(0, 160)}`);
      }
      return r.json();
    };

    Promise.all([
      fetchJSON(
        process.env.NEXT_PUBLIC_API_BASE + "/reports/sql/daily-revenue"
      ),
      fetchJSON(process.env.NEXT_PUBLIC_API_BASE + "/reports/mongo/category"),
    ])
      .then(([r1, r2]) => {
        setRev(toArray<RevenueRow>(r1));
        setCats(toArray<CategoryRow>(r2));
      })
      .catch((e: any) => setErr(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <section>
        <h1 className="h1 mb-3">Reports</h1>
        <p>Loading…</p>
      </section>
    );
  if (err)
    return (
      <section>
        <h1 className="h1 mb-3">Reports</h1>
        <p className="text-red-600">{err}</p>
      </section>
    );

  return (
    <section className="grid sm:grid-cols-2 gap-6">
      <div className="card card-pad">
        <h2 className="h2 mb-2">Daily Revenue (SQL)</h2>
        {(!rev || rev.length === 0) && <p className="muted">No data</p>}
        {rev &&
          rev.length > 0 &&
          rev.map((r) => (
            <div key={r.date} className="flex justify-between py-1">
              <span>{r.date}</span>
              <span>₹{r.total}</span>
            </div>
          ))}
      </div>

      <div className="card card-pad">
        <h2 className="h2 mb-2">By Category (Mongo)</h2>
        {(!cats || cats.length === 0) && <p className="muted">No data</p>}
        {cats &&
          cats.length > 0 &&
          cats.map((c) => (
            <div key={c.category} className="flex justify-between py-1">
              <span>{c.category}</span>
              <span>{c.count}</span>
            </div>
          ))}
      </div>
    </section>
  );
}
