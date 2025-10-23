import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

function qs(p: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== "") u.set(k, String(v));
  });
  return u.toString();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = get("q") || "";
  const category = get("category") || "";
  const page = Number(get("page") || 1);
  const evalSort = get("evalSort") === "asc" ? "asc" : undefined;

  const res = await api(
    `/products?${qs({
      q: q || undefined,
      category: category || undefined,
      page,
    })}`,
    undefined,
    evalSort
  );
  const data = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Products</h1>

      <form
        action="/products"
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input name="q" defaultValue={q} placeholder="search..." />
        <input
          name="category"
          defaultValue={category}
          placeholder="category..."
        />
        <select name="evalSort" defaultValue={evalSort || ""}>
          <option value="">price: desc (default)</option>
          <option value="asc">price: asc (server override)</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {data.items.map((p: any) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        q={q || undefined}
        category={category || undefined}
        evalSort={evalSort}
      />
    </main>
  );
}
