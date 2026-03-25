import { Edit2, Trash2 } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const isLowStock = product.stock <= 5;

  return (
    <div className="nodo-card flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-all border border-[#111]">
      {/* ENCABEZADO CON COLOR (Alto Contraste) */}
      <div className="bg-[#111] text-white p-4 flex justify-between items-start border-b border-[#111]">
        <div className="min-w-0 pr-2">
          <h3
            className="text-[13px] font-bold uppercase tracking-[0.1em] truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-[9px] font-mono text-[#aaa] tracking-widest mt-1 uppercase">
            SKU: {product.sku || "N/A"}
          </p>
        </div>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <p className="text-[11px] text-[#666] font-medium leading-relaxed line-clamp-2 min-h-[34px]">
          {product.description || "Sin descripción."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--nodo-border-light)]">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#888] block mb-0.5">
              Precio
            </span>
            <span className="text-[14px] font-bold font-mono text-[#111]">
              $
              {Number(product.price).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#888] block mb-0.5">
              Stock
            </span>
            <span
              className={`text-[12px] font-bold font-mono ${isLowStock ? "text-red-600" : "text-[#111]"}`}
            >
              {product.stock} un.
            </span>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="grid grid-cols-2 border-t border-[#111] bg-[#fafafa]">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-[#111] hover:bg-[#eaeaea] border-r border-[#111] transition-colors"
        >
          <Edit2 size={13} strokeWidth={2} /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} strokeWidth={2} /> Eliminar
        </button>
      </div>
    </div>
  );
}
