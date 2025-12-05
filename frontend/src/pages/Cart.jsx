import { useEffect, useState } from "react";
import { fetchCart, removeCartItem, updateCartItem } from "../api";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import ProductDetails from "./ProductDetails";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  const load = () => fetchCart().then(setCart).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="flex justify-center items-center h-screen font-light text-3xl">
          Go to Home Page to Shop and add Items to the Cart !
        </p>
      ) : (
        <>
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={(id) => removeCartItem(id).then(load)}
              onUpdate={(id, qty) => updateCartItem(id, qty).then(load)}
            />
          ))}
          <p className="text-xl font-semibold mt-4">
            Total: ₹{cart.total.toFixed(2)}
          </p>
          <Link
            to="/checkout"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}
