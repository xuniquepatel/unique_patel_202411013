"use client";

type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  function addToCart() {
    const raw = localStorage.getItem("cart");
    const cart: { productId: string; quantity: number }[] = raw
      ? JSON.parse(raw)
      : [];
    const idx = cart.findIndex((x) => x.productId === p._id);
    if (idx === -1) cart.push({ productId: p._id, quantity: 1 });
    else cart[idx].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
      <div style={{ fontWeight: 600 }}>{p.name}</div>
      <div>₹{p.price}</div>
      <button onClick={addToCart} style={{ marginTop: 8 }}>
        Add to Cart
      </button>
    </div>
  );
}
