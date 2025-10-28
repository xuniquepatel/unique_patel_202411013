export default function Page() {
  return (
    <section className="card card-pad">
      <h1 className="h1">Welcome 👋</h1>
      <p className="muted mt-2">
        Browse products, add to cart, preview totals on the server, then
        checkout.
      </p>
      <div className="mt-4 flex gap-3">
        <a className="btn" href="/products">
          Start shopping
        </a>
        <a className="btn-outline" href="/login">
          Login
        </a>
      </div>
    </section>
  );
}
