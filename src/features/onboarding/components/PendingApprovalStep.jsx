import { Loader2, RefreshCw } from "lucide-react";

export default function PendingApprovalStep({ pendingCompany }) {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm flex flex-col gap-10">
        {/* Encabezado */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999] block mb-4">
            Acceso Pendiente
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#111] leading-none">
            Solicitud
            <br />
            en revisión
          </h1>
        </div>

        {/* Card empresa */}
        <div className="border-2 border-[#111] bg-white flex flex-col">
          {/* Encabezado de card */}
          <div className="flex items-stretch border-b-2 border-[#111]">
            <div className="w-14 shrink-0 bg-amber-400 border-r-2 border-[#111] flex items-center justify-center">
              <Loader2
                size={20}
                className="text-amber-900 animate-[spin_3s_linear_infinite]"
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 px-6 py-3 bg-amber-50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900">
                Vinculación Pendiente
              </span>
            </div>
          </div>

          {/* Datos empresa */}
          <div className="px-6 py-7 flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-3">
              Empresa
            </p>
            <p className="text-[18px] font-black uppercase tracking-tight text-[#111] leading-tight">
              {pendingCompany?.legal_name}
            </p>
            <p className="text-[11px] font-mono text-[#777] tracking-widest mt-2">
              CUIT: {pendingCompany?.tax_id}
            </p>
          </div>

          {/* Nota informativa */}
          <div className="px-6 py-5 border-t-2 border-dashed border-[#ddd] bg-[#fafafa]">
            <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest leading-relaxed">
              Un administrador debe aprobar tu solicitud para que puedas operar
              en la plataforma.
            </p>
          </div>
        </div>

        {/* Botón actualizar */}
        <button
          onClick={() => window.location.reload()}
          className="w-full border-2 border-[#111] bg-[#111] text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 py-5 cursor-pointer"
        >
          <RefreshCw size={14} strokeWidth={2.5} /> Actualizar Estado
        </button>
      </div>
    </div>
  );
}
