export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import ProductListClient from "@/components/ProductListClient";

function qs(p: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(p))
    if (v !== undefined) u.set(k, String(v));
  return u.toString();
}

export default async function Page({ searchParams }: any) {
  const q = String(searchParams.q ?? "");
  const page = Number(searchParams.page ?? 1);
  const evalSort = searchParams.evalSort === "asc" ? "asc" : undefined;

  try {
    const res = await api(
      `/products?${qs({ q: q || undefined, page })}`,
      undefined,
      evalSort
    );
    const data = await res.json();
    return (
      <section>
        <div className="mb-6">
          <h1 className="h1">Products</h1>
          <p className="muted mt-1">
            Default sort: price ↓. Try{" "}
            <a className="link underline" href="/products?evalSort=asc">
              ASC
            </a>
            .
          </p>
        </div>
        <ProductListClient items={data.items} />
        <div className="muted mt-6">
          Page {data.page} / {data.totalPages}
        </div>
      </section>
    );
  } catch (e: any) {
    return (
      <section>
        <h1 className="h1">Products</h1>
        <p className="text-red-600">{String(e)}</p>
      </section>
    );
  }
}
