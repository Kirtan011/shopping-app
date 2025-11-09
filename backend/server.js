const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Load products from JSON
const productsPath = path.join(__dirname, "data", "products.json");
let PRODUCTS = [];
try {
  PRODUCTS = JSON.parse(fs.readFileSync(productsPath));
} catch (err) {
  console.error("Could not load products.json, using fallback.");
  PRODUCTS = [];
}

// In-memory cart: array of { id: cartItemId, productId, qty }
let CART = [];

// GET /api/products
app.get("/api/products", (req, res) => {
  res.json(PRODUCTS);
});

// GET /api/cart -> returns cart items with product details and total
app.get("/api/cart", (req, res) => {
  const items = CART.map((ci) => {
    const p = PRODUCTS.find((x) => x.id === ci.productId) || {};
    return {
      id: ci.id,
      productId: ci.productId,
      name: p.name || "Unknown",
      price: p.price || 0,
      qty: ci.qty || 0,
      image: p.image || null,
      lineTotal: (p.price || 0) * (ci.qty || 0),
    };
  });
  const total = items.reduce((s, it) => s + it.lineTotal, 0);
  res.json({ items, total });
});
// POST /api/cart -> add { productId, qty }
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  console.log("🛍 Add request:", req.body);

  // find the product in PRODUCTS array
  const product = PRODUCTS.find(
    (p) => p._id === productId || p.id === productId
  );
  if (!product) return res.status(404).json({ message: "Product not found" });

  // check if already in cart
  const existing = CART.find((item) => item.productId === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    CART.push({
      id: uuidv4(),
      productId,
      qty,
    });
  }

  // compute total and send full cart back
  const items = CART.map((ci) => {
    const p = PRODUCTS.find((x) => x.id === ci.productId) || {};
    return {
      id: ci.id,
      productId: ci.productId,
      name: p.name || "Unknown",
      price: p.price || 0,
      qty: ci.qty || 0,
      image: p.image || null,
      lineTotal: (p.price || 0) * (ci.qty || 0),
    };
  });
  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

  res.json({ items, total });
});

// DELETE /api/cart/:id -> remove item by cart item id
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const idx = CART.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Cart item not found" });
  const removed = CART.splice(idx, 1)[0];
  res.json({ message: "Removed", removed });
});

// PATCH /api/cart/:id -> update qty
app.patch("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { qty } = req.body || {};
  if (!qty || qty <= 0)
    return res.status(400).json({ error: "qty (>0) required" });
  const ci = CART.find((c) => c.id === id);
  if (!ci) return res.status(404).json({ error: "Cart item not found" });
  ci.qty = Number(qty);
  res.json({ message: "Updated", cartItem: ci });
});

// POST /api/checkout -> { cartItems } (array of { productId, qty } )
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body || {};
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res
      .status(400)
      .json({ error: "cartItems (non-empty array) required" });
  }
  // compute total
  let total = 0;
  const receiptItems = cartItems.map((ci) => {
    const p = PRODUCTS.find((x) => x.id === ci.productId) || {
      name: "Unknown",
      price: 0,
    };
    const lineTotal = (p.price || 0) * (ci.qty || 0);
    total += lineTotal;
    return {
      productId: ci.productId,
      name: p.name,
      price: p.price,
      qty: ci.qty,
      lineTotal,
    };
  });
  const receipt = {
    id: uuidv4(),
    items: receiptItems,
    total,
    timestamp: new Date().toISOString(),
  };

  // clear server cart (mock checkout)
  CART = [];

  res.json({ message: "Checkout successful (mock)", receipt });
});

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
