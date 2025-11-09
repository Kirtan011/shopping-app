import { useState, useEffect } from "react";
import { fetchCart, checkout } from "../api";
import ReceiptModal from "../components/ReceiptModal";

export default function Checkout() {
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ items: [], total: 0 });

  // ✅ Load cart when page mounts
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  // ✅ Handle Checkout
  async function handleCheckout() {
    if (!customer.name || !customer.email) {
      alert("Please fill out all fields before checkout.");
      return;
    }

    setLoading(true);
    try {
      const cartData = await fetchCart(); // fetch latest cart
      const result = await checkout(cartData.items, customer);
      setReceipt(result); // ✅ show modal
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-800 text-gray-100 relative">
      {/* Checkout Card */}
      <div className="bg-black rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">
          Checkout
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Complete your purchase securely
        </p>

        {/* Customer Details */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300 font-medium">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Kirtan Suthar"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300 font-medium">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="kirtan@example.com"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* Confirm & Pay Button */}
        <button
          onClick={handleCheckout}
          disabled={loading || cart.total === 0}
          className={`w-full mt-6 py-3 rounded-lg text-lg font-semibold transition-all ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          }`}
        >
          {loading ? (
            "Processing..."
          ) : cart.total === 0 ? (
            "Add Item to Cart"
          ) : (
            <>
              Confirm and Pay{" "}
              <span className="font-bold text-green-300">
                ₹{cart.total?.toFixed(2) || "0.00"}
              </span>
            </>
          )}
        </button>

        <p className="text-gray-500 text-xs text-center mt-5">
          By confirming, you agree to our Terms & Privacy Policy.
        </p>
      </div>

      {/* ✅ Show Receipt Modal After Payment */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
}
