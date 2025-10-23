"use client";

import { ReactNode, useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Protected({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) router.replace("/login");
    else setOk(true);
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
