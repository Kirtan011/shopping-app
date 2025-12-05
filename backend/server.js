const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(bodyParser.json());

let PRODUCTS = [];
let CART = [];
let CATEGORIES = [];

// LOAD PRODuCTS (DummyJSON)

async function loadProducts() {
  try {
    const res = await axios.get("https://dummyjson.com/products?limit=100");

    PRODUCTS = res.data.products.map((p) => ({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.thumbnail,
      description: p.description,
    }));

    console.log("Products loaded from DummyJSON:", PRODUCTS.length);
  } catch (err) {
    console.error("Failed to load 3rd-party products:", err.message);
    PRODUCTS = [];
  }
}

loadProducts();

async function loadCategories() {
  try {
    const res = await axios.get("https://dummyjson.com/products/categories");
    CATEGORIES = res.data;
    console.log("Categories loaded:", CATEGORIES.length);
  } catch (err) {
    console.error("Failed to load categories:", err.message);
    CATEGORIES = [];
  }
}

loadCategories();

//GET CATEGORIES
app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES);
});

// GET PRODUCTS BY CATEGORIES
app.get("/api/products", async (req, res) => {
  const { category } = req.query;
  if (PRODUCTS.length === 0) {
    await loadProducts();
  }
  let result = PRODUCTS;
  if (category) {
    result = result.filter((p) => p.category === category);
  }
  res.json(result);
});

// GET CART
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

// ADD TO CART
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

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

// DELETE CART ITEM
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const idx = CART.findIndex((c) => c.id === id);

  if (idx === -1) return res.status(404).json({ error: "Cart item not found" });

  const removed = CART.splice(idx, 1)[0];
  res.json({ message: "Removed", removed });
});

// UPDATE CART QTY

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

app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body || {};

  if (!Array.isArray(cartItems) || cartItems.length === 0)
    return res
      .status(400)
      .json({ error: "cartItems (non-empty array) required" });

  let total = 0;

  const receiptItems = cartItems.map((ci) => {
    const p = PRODUCTS.find((x) => x.id === ci.productId) || {};
    const lineTotal = (p.price || 0) * (ci.qty || 0);
    total += lineTotal;

    return {
      productId: ci.productId,
      name: p.name || "Unknown",
      price: p.price || 0,
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

  CART = [];

  res.json({ message: "Checkout successful (mock)", receipt });
});

//HEALT CHECK
app.get("/api/health", (req, res) => res.json({ ok: true }));

//PORT LISTENER
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
