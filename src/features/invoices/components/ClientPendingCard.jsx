import { Check, X, Loader2 } from "lucide-react";

export default function ClientPendingCard({
  rel,
  processingId,
  onUpdateStatus,
}) {
  return (
    <div className="p-5 border border-[#111] bg-white flex flex-col gap-5 transition-colors hover:bg-[#fafafa]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#111] border border-[#111] text-white flex items-center justify-center font-black text-[14px] uppercase tracking-widest shrink-0">
          {rel.client.legal_name.substring(0, 2)}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-[12px] font-black uppercase tracking-tight text-[#111] truncate">
            {rel.client.legal_name}
          </h3>
          <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1 font-mono">
            CUIT: {rel.client.tax_id}
          </p>
        </div>
      </div>

      {/* Botones unidos con bordes rectos */}
      <div className="flex items-center gap-0 border border-[#111] mt-auto">
        <button
          onClick={() => onUpdateStatus(rel.id, "approved")}
          disabled={processingId === rel.id}
          className="flex-1 bg-[#111] text-white flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 border-r border-[#111]"
        >
          {processingId === rel.id ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} strokeWidth={3} />
          )}
          Aceptar
        </button>
        <button
          onClick={() => onUpdateStatus(rel.id, "rejected")}
          disabled={processingId === rel.id}
          className="flex-1 bg-white text-[#111] flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#f4f4f4] transition-colors disabled:opacity-50"
        >
          <X size={14} strokeWidth={2.5} />
          Rechazar
        </button>
      </div>
    </div>
  );
}
