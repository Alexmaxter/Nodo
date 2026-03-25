import { Edit, Trash2 } from "lucide-react";

export default function ProductListItem({ product, onEdit, onDelete }) {
  return (
    <div className="flex flex-col md:flex-row bg-white border border-[#111] transition-colors hover:bg-[#fafafa]">
      {/* Información del Producto (Izquierda) */}
      <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-5 border-b md:border-b-0 md:border-r border-[#111]">
        <div className="w-12 h-12 bg-[#111] text-white flex items-center justify-center font-black text-[14px] uppercase tracking-widest shrink-0">
          {product.name.substring(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-[14px] font-black uppercase tracking-tight text-[#111]">
              {product.name}
            </h3>
            {product.sku && (
              <span className="px-2 py-0.5 bg-[#f4f4f4] border border-[#111] text-[9px] font-bold uppercase tracking-widest text-[#111]">
                SKU: {product.sku}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#666] font-medium line-clamp-1">
            {product.description || "Sin descripción detallada."}
          </p>
        </div>
      </div>

      {/* Precio y Acciones (Derecha) */}
      <div className="flex items-stretch justify-between md:justify-end bg-gray-50 md:bg-transparent min-w-[240px]">
        {/* Precio */}
        <div className="px-6 py-5 flex items-center justify-center border-r border-[#111] flex-1 md:flex-none">
          <span className="text-lg font-mono font-black text-[#111]">
            ${product.price?.toFixed(2) || "0.00"}
          </span>
        </div>

        {/* Botones */}
        <div className="flex">
          <button
            onClick={() => onEdit(product)}
            className="px-5 text-[#111] hover:bg-[#e0e0e0] transition-colors border-r border-[#111] flex items-center justify-center"
            title="Editar Producto"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-5 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
            title="Eliminar Producto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
