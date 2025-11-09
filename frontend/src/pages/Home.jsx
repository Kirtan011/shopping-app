import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      alert(" Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(" Failed to add to cart.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id || p.id}
            product={p}
            onAdd={handleAddToCart}
          />
        ))}
      </div>
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
    </div>
  );
}
