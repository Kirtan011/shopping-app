import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added loading state

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <div className="mt-7 min-h-screen flex flex-col">
      {/* ✅ Loader */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 py-8 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 border-t border-gray-800 pt-8 pb-6 text-center text-gray-400 text-sm bg-gray-950/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()}{" "}
                <span className="text-white font-semibold">ShopVop</span>. All
                rights reserved.
              </p>

              <div className="hidden sm:block h-5 w-[2px] bg-gray-700 mx-6"></div>

              <p className="mt-3 sm:mt-0 text-gray-500 hover:text-white transition">
                Designed & Developed by{" "}
                <span className="font-medium text-gray-300">Kirtan Suthar</span>
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
