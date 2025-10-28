import "./globals.css";
import NavbarClient from "@/components/NavbarClient";

export const metadata = { title: "Shop" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a className="link" href="/">
              Home
            </a>
            <a className="link" href="/products">
              Products
            </a>
            <a className="link" href="/cart">
              Cart
            </a>
            <a className="link" href="/reports">
              Reports
            </a>
            <NavbarClient />
          </div>
        </nav>
        <main className="section">{children}</main>
      </body>
    </html>
  );
}
