"use client";

import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  q,
  category,
  evalSort,
}: {
  page: number;
  totalPages: number;
  q?: string;
  category?: string;
  evalSort?: "asc";
}) {
  const params = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (category) u.set("category", category);
    if (evalSort) u.set("evalSort", evalSort);
    u.set("page", String(p));
    return `?${u.toString()}`;
  };
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}
    >
      <Link aria-disabled={page <= 1} href={page <= 1 ? "#" : params(page - 1)}>
        Prev
      </Link>
      <span>
        {page} / {totalPages || 1}
      </span>
      <Link
        aria-disabled={page >= totalPages}
        href={page >= totalPages ? "#" : params(page + 1)}
      >
        Next
      </Link>
    </div>
  );
}
