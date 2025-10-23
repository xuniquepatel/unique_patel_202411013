import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop", description: "Demo store" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
