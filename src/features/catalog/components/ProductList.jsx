import { PackageSearch } from "lucide-react";
import ProductListItem from "./ProductListItem";

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 bg-[#fcfcfc] border border-[#111]">
        <PackageSearch
          className="text-[#ccc] mb-6"
          size={48}
          strokeWidth={1.5}
        />
        <p className="text-[13px] font-black text-[#111] uppercase tracking-[0.2em] mb-2">
          Catálogo Vacío
        </p>
        <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest max-w-sm text-center">
          Tu lista de productos está vacía o no se encontraron coincidencias con
          tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
