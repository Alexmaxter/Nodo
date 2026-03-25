import { Search, Plus, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupplierActionBar({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
      {/* Buscador */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]" />
        <input
          type="text"
          placeholder="Buscar proveedor..."
          className="w-full bg-white border border-[#111] pl-11 pr-4 py-3 text-[11px] font-bold text-[#111] focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-[#111] uppercase tracking-[0.15em] transition-colors rounded-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Botones de Acción Planos */}
      <div className="flex flex-col sm:flex-row gap-0 w-full md:w-auto border border-[#111]">
        <button
          onClick={() => navigate("/panel/red")}
          className="flex items-center justify-center gap-2 py-3 px-6 w-full sm:w-auto bg-white text-[#111] hover:bg-[#f4f4f4] transition-colors border-b sm:border-b-0 sm:border-r border-[#111]"
        >
          <Globe size={15} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Explorar Red
          </span>
        </button>
        <button className="flex items-center justify-center gap-2 py-3 px-6 w-full sm:w-auto bg-[#111] text-white hover:bg-[#333] transition-colors">
          <Plus size={15} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Nuevo Proveedor
          </span>
        </button>
      </div>
    </div>
  );
}
