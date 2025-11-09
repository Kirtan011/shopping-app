export default function CartItem({ item, onRemove, onUpdate }) {
  return (
    <div className="flex items-center justify-between bg-gray-950/80 border border-gray-700 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-600"
          />
        )}

        <div>
          <p className="font-semibold text-gray-100">{item.name}</p>
          <p className="text-gray-400 text-sm">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => onUpdate(item.id, Number(e.target.value))}
          className="w-16 text-center bg-gray-900 border border-gray-600 text-gray-100 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <button
          onClick={() => onRemove(item.id)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
