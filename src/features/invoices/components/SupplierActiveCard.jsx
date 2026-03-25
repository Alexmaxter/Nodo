import { ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupplierActiveCard({ rel }) {
  const navigate = useNavigate();
  const hasDebt = rel.balance > 0;

  return (
    <div className="flex flex-col bg-white border border-[#111] h-full transition-colors hover:bg-[#fafafa]">
      {/* Cuerpo de la Tarjeta */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="w-10 h-10 border border-[#111] bg-[#111] text-white flex items-center justify-center font-black text-[14px] uppercase tracking-widest">
            {rel.supplier.legal_name.substring(0, 2)}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-white border border-[#111] text-[#111]">
            Verificado
          </span>
        </div>

        <h3 className="text-[14px] font-black text-[#111] uppercase tracking-tight line-clamp-2 mb-1">
          {rel.supplier.legal_name}
        </h3>
        <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] mb-6 font-mono">
          CUIT: {rel.supplier.tax_id}
        </p>

        {/* Caja de Balance Plana */}
        <div
          className={`mt-auto p-4 border border-[#111] ${
            hasDebt ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          <p
            className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
              hasDebt ? "text-red-900" : "text-emerald-900"
            }`}
          >
            {hasDebt ? "Deuda Pendiente" : "Saldo al Día"}
          </p>
          <p
            className={`text-xl font-mono font-black tracking-tight ${
              hasDebt ? "text-red-900" : "text-emerald-900"
            }`}
          >
            ${" "}
            {Math.abs(rel.balance).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Botones Inferiores (Divididos por borde rígido) */}
      <div className="flex border-t border-[#111]">
        <button
          onClick={() =>
            navigate(`/panel/proveedor/${rel.supplier.id}/nuevo-pedido`)
          }
          className="flex-1 flex justify-center items-center gap-2 py-4 bg-[#111] text-white hover:bg-[#333] transition-colors border-r border-[#111]"
          title="Hacer un nuevo pedido"
        >
          <ShoppingCart size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
            Pedir
          </span>
        </button>

        <button
          onClick={() => navigate(`/panel/proveedor/${rel.supplier.id}`)}
          className="flex-1 flex justify-center items-center gap-2 py-4 bg-white text-[#111] hover:bg-[#f4f4f4] transition-colors"
          title="Ver detalle de cuenta"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
            Ver Cuenta
          </span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
