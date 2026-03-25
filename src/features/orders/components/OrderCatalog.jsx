import { PackageSearch, Plus } from "lucide-react";

export default function OrderCatalog({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 bg-gray-50 border border-dashed border-gray-300">
        <PackageSearch className="text-gray-400 mb-4" size={48} />
        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
          Este proveedor no tiene productos publicados
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-[#111] p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-tight text-[#111]">
              {product.name}
            </h3>
            {product.sku && (
              <p className="text-[9px] font-bold text-[#666] uppercase tracking-widest mt-1">
                SKU: {product.sku}
              </p>
            )}
            <p className="text-[12px] mt-2 text-gray-700 line-clamp-2 leading-relaxed">
              {product.description || "Sin descripción disponible."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-[16px] font-black text-[#111]">
              ${product.price?.toFixed(2) || "0.00"}
            </span>
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white hover:bg-[#333] transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Agregar
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
