import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function OrderCart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  isSubmitting,
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-[#fcfcfc] border border-[#111] flex flex-col h-full max-h-[calc(100vh-140px)] sticky top-0">
      <div className="p-5 border-b border-[#111] bg-[#111] text-white flex items-center gap-3">
        <ShoppingCart size={18} />
        <h2 className="text-[12px] font-bold uppercase tracking-[0.2em]">
          Resumen del Pedido
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {cart.length === 0 ? (
          <p className="text-[11px] text-[#666] font-semibold tracking-widest uppercase text-center mt-10">
            El pedido está vacío
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 pb-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-black uppercase text-[#111] leading-tight pr-4">
                  {item.name}
                </span>
                <span className="text-[12px] font-bold text-[#111]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-[#111]">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-[11px] font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-gray-100 transition-colors border-l border-[#111]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 border-t border-[#111] bg-white">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-bold text-[#666] uppercase tracking-widest">
            Total Estimado
          </span>
          <span className="text-xl font-black text-[#111]">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onSubmitOrder}
          disabled={cart.length === 0 || isSubmitting}
          className="w-full py-3 bg-[#111] text-white hover:bg-[#333] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <span className="text-[11px] font-bold uppercase tracking-widest animate-pulse">
              Procesando...
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Emitir Pedido
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
