import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Shop" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="section">{children}</main>
      </body>
    </html>
  );
}
