import { api } from "@/lib/api";
export default async function Page() {
  const token = "";
  const res1 = await fetch(
    process.env.NEXT_PUBLIC_API_BASE + "/reports/sql/daily-revenue",
    { headers: { Authorization: "Bearer " + token } }
  );
  const res2 = await fetch(
    process.env.NEXT_PUBLIC_API_BASE + "/reports/mongo/category",
    { headers: { Authorization: "Bearer " + token } }
  );
  const a = await res1.json(),
    b = await res2.json();
  return (
    <main>
      <h1>Reports</h1>
      <pre>{JSON.stringify(a, null, 2)}</pre>
      <pre>{JSON.stringify(b, null, 2)}</pre>
    </main>
  );
}
