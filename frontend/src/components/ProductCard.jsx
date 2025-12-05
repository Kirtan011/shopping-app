import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-gray-950/80 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={
            product.image || "https://via.placeholder.com/200x200?text=No+Image"
          }
          alt={product.name}
          className="w-full h-40 sm:h-48 md:h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />

        {product.badge && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col grow">
        <h3 className="font-light text-base sm:text-lg text-white">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm sm:text-base line-clamp-2 mb-3">
          {product.description || "High-quality product you'll love."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
          <p className="text-blue-400 font-light text-xl sm:text-2xl">
            ₹{product.price}
          </p>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link to={`/product/${product.id}`} className="w-full">
              <button className="w-full bg-blue-900 hover:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-95 active:scale-90">
                View
              </button>
            </Link>

            <button
              onClick={() => onAdd(product._id || product.id)}
              className="w-full bg-blue-900 hover:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-95 active:scale-90"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
