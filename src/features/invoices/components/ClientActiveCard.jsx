import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientActiveCard({ rel }) {
  const navigate = useNavigate();
  const clientOwesMoney = rel.balance > 0;

  return (
    <div className="flex flex-col bg-white border border-[#111] h-full transition-colors hover:bg-[#fafafa]">
      {/* Cuerpo de la Tarjeta */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="w-10 h-10 border border-[#111] bg-[#111] text-white flex items-center justify-center font-black text-[14px] uppercase tracking-widest">
            {rel.client.legal_name.substring(0, 2)}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-white border border-[#111] text-[#111]">
            Cuenta Activa
          </span>
        </div>

        <h3 className="text-[14px] font-black text-[#111] uppercase tracking-tight line-clamp-2 mb-1">
          {rel.client.legal_name}
        </h3>
        <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] mb-6 font-mono">
          CUIT: {rel.client.tax_id}
        </p>

        {/* Caja de Saldo Plana */}
        <div
          className={`mt-auto p-4 border border-[#111] ${
            clientOwesMoney ? "bg-amber-50" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
              clientOwesMoney ? "text-amber-900" : "text-[#111]"
            }`}
          >
            {clientOwesMoney ? "Saldo a Cobrar" : "Cuenta al Día"}
          </p>
          <p
            className={`text-xl font-mono font-black tracking-tight ${
              clientOwesMoney ? "text-amber-900" : "text-[#111]"
            }`}
          >
            ${" "}
            {Math.abs(rel.balance).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Botón Inferior */}
      <div className="flex border-t border-[#111]">
        <button
          onClick={() => navigate(`/panel/cliente/${rel.client.id}`)}
          className="w-full flex justify-center items-center gap-2 py-4 bg-white text-[#111] hover:bg-[#f4f4f4] transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Gestionar Cuenta
          </span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
