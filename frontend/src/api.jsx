const BASE = import.meta.env.DEV
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_BASE;

export async function fetchProducts() {
  const res = await fetch(`${BASE}/api/products`);
  if (!res.ok) throw new Error("Could not fetch products");
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${BASE}/api/cart`);
  if (!res.ok) throw new Error("Could not fetch cart");
  return res.json();
}

export async function addToCart(productId, qty = 1) {
  const res = await fetch(`${BASE}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  return res.json();
}

export async function removeCartItem(id) {
  const res = await fetch(`${BASE}/api/cart/${id}`, { method: "DELETE" });
  return res.json();
}

export async function updateCartItem(id, qty) {
  const res = await fetch(`${BASE}/api/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
  });
  return res.json();
}
export async function checkout(items, customer) {
  try {
    const res = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customer }),
    });
    const data = await res.json();

    // ✅ Ensure consistent format
    return {
      id:
        data.id || data._id || "TXN-" + Math.random().toString(36).substr(2, 9),
      timestamp: data.timestamp || new Date().toISOString(),
      total:
        data.total ||
        items.reduce((sum, item) => sum + item.price * item.qty, 0),
      items: data.items || items,
    };
  } catch (err) {
    console.error("Checkout failed", err);
    return null;
  }
}
