import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart, updateCartItem, fetchCart } from "../api";

const BASE = import.meta.env.DEV
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_BASE;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/products`)
      .then((r) => r.json())
      .then((list) => {
        const found = list.find((p) => String(p.id) === id);
        setProduct(found);
      });

    fetchCart().then((cart) => {
      const item = cart.items.find((c) => String(c.productId) === id);
      if (item) {
        setCartItemId(item.id);
        setCount(item.qty);
      }
    });
  }, [id]);

  const handleAdd = async () => {
    if (!cartItemId) {
      await addToCart(product.id, 1);
      const cart = await fetchCart();
      const item = cart.items.find((c) => c.productId === product.id);
      setCartItemId(item.id);
      setCount(item.qty);
      return;
    }

    const newQty = count + 1;
    setCount(newQty);
    await updateCartItem(cartItemId, newQty);
  };

  const handleDrop = async () => {
    if (count <= 1) return;

    const newQty = count - 1;
    setCount(newQty);
    await updateCartItem(cartItemId, newQty);
  };

  const addToCartNow = async () => {
    await addToCart(product.id, count);
    alert("Added to cart!");
  };

  if (!product)
    return <p className="text-center p-10 text-xl">Loading product...</p>;

  return (
    <div className="mt-12 max-w-2xl mx-auto p-4">
      <img src={product.image} className="w-60 mx-auto" />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-400/80 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">₹{product.price}</p>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleDrop}
          className="bg-red-700  text-white w-10 h-7 rounded-lg  cursor-pointer text-xl"
        >
          -
        </button>

        <div className="text-2xl font-semibold">{count}</div>

        <button
          onClick={handleAdd}
          className="bg-green-700 text-white w-10 h-7 cursor-pointer rounded-lg text-xl"
        >
          +
        </button>
      </div>

      <button
        onClick={addToCartNow}
        className="mt-8 bg-blue-600 text-white  cursor-pointer px-5 py-2 rounded"
      >
        Add {count} to Cart
      </button>
    </div>
  );
}
