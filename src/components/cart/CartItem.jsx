export default function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover rounded-md" />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-12 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>

      <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800 ml-4">
        Remove
      </button>
    </div>
  );
}
