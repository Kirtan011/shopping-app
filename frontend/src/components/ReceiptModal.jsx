import { useEffect, useRef } from "react";

export default function ReceiptModal({ receipt, onClose }) {
  const modalRef = useRef(null);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close modal if clicked outside content box
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!receipt) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-gray-900 text-gray-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 transform transition-all scale-100 animate-slideUp"
      >
        <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-700 pb-2 text-white">
          Payment Receipt
        </h2>

        <div className="space-y-2 text-sm text-gray-300 mb-4">
          <p>
            <span className="font-medium text-gray-200">Transaction ID:</span>{" "}
            {receipt.id || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-200">Date:</span>{" "}
            {new Date(receipt.timestamp).toLocaleString()}
          </p>
          <p>
            <span className="font-medium text-gray-200">Total Paid:</span>{" "}
            <span className="text-green-400 font-semibold">
              ₹{receipt.total?.toFixed(2) || "0.00"}
            </span>
          </p>
        </div>

        <div className="border-t border-b border-gray-700 py-3 max-h-48 overflow-y-auto custom-scrollbar">
          {receipt.items?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700 text-left">
                  <th className="py-1">Item</th>
                  <th className="py-1">Qty</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <td className="py-1 text-gray-200">{item.name}</td>
                    <td className="py-1">{item.qty}</td>
                    <td className="py-1 text-right">
                      ₹{(item.lineTotal || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-2">No items found.</p>
          )}
        </div>

        <div className="mt-5 text-center">
          <p className="text-gray-400 text-xs mb-3">
            Thank you for shopping with us!
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2.5 rounded-lg text-white font-semibold shadow-md hover:scale-105"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
