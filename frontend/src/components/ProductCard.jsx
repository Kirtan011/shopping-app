export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-gray-950/80   rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative overflow-hidden border-gray-700 rounded-xl mb-4">
        <img
          src={
            product.image || "https://via.placeholder.com/200x200?text=No+Image"
          }
          alt={product.name}
          className="h-48 w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />

        {product.badge && (
          <span className="absolute top-2 left-2 bg-blue-200 text-white text-xs px-2 py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col grow">
        <h3 className="font-light text-lg text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
          {product.description || "High-quality product you'll love."}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-blue-400 font-light text-xl">₹{product.price}</p>

          <button
            onClick={() => onAdd(product._id || product.id)}
            className="bg-blue-900 hover:bg-blue-400 text-white font-md px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-90 cursor-pointer active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
