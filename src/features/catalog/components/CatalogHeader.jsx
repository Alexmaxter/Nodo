import { Package, Search, Plus } from "lucide-react";

export default function CatalogHeader({
  searchQuery,
  onSearchChange,
  onNewProduct,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-[#111] pb-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-[#111] flex items-center gap-3">
          <Package size={24} strokeWidth={2} /> Mi Catálogo
        </h1>
        <p className="text-[11px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1">
          Gestiona tus productos, precios y stock disponible.
        </p>
      </div>

      {/* Buscador y Botón en un solo bloque duro */}
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-0 border border-[#111]">
        <div className="relative w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-[#111]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111]"
            size={14}
          />
          <input
            type="text"
            placeholder="Buscar producto o SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white pl-11 pr-4 py-3 text-[11px] font-bold text-[#111] focus:outline-none focus:bg-[#f4f4f4] uppercase tracking-[0.1em] transition-colors rounded-none"
          />
        </div>

        <button
          onClick={onNewProduct}
          className="flex items-center justify-center gap-2 py-3 px-6 bg-[#111] text-white hover:bg-[#333] transition-colors whitespace-nowrap"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Nuevo Producto
          </span>
        </button>
      </div>
    </div>
  );
}
