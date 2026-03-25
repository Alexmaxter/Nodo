import { Building2, UserPlus, ArrowRight } from "lucide-react";

export default function CompanyEntrySelector({ onSelect }) {
  return (
    <div className="max-w-3xl w-full px-4">
      {/* Encabezado */}
      <div className="mb-16">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999] block mb-4">
          Configuración Inicial
        </span>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-[#111] leading-none">
          ¿Cómo deseas
          <br />
          ingresar?
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* ── CREAR EMPRESA ─────────────────────────────────── */}
        <button
          onClick={() => onSelect("create")}
          className="w-full text-left border-2 border-[#111] bg-white cursor-pointer flex items-stretch"
        >
          {/* Columna ícono */}
          <div className="w-24 shrink-0 bg-blue-600 flex items-center justify-center border-r-2 border-[#111]">
            <Building2 size={32} className="text-white" strokeWidth={1.5} />
          </div>

          {/* Contenido */}
          <div className="flex-1 px-8 py-8 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-2">
                Nueva entidad
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#111] leading-tight">
                Registrar Empresa
              </h2>
            </div>
            <p className="text-[11px] font-bold text-[#666] uppercase tracking-wider leading-relaxed max-w-sm">
              Crea una nueva entidad legal para gestionar catálogos, pedidos y
              facturación desde cero.
            </p>
          </div>

          {/* Flecha */}
          <div className="w-16 shrink-0 border-l-2 border-[#111] flex items-center justify-center bg-blue-50">
            <ArrowRight size={18} className="text-blue-700" strokeWidth={2.5} />
          </div>
        </button>

        {/* ── UNIRSE A EQUIPO ────────────────────────────────── */}
        <button
          onClick={() => onSelect("join")}
          className="w-full text-left border-2 border-[#111] bg-white cursor-pointer flex items-stretch"
        >
          {/* Columna ícono */}
          <div className="w-24 shrink-0 bg-emerald-600 flex items-center justify-center border-r-2 border-[#111]">
            <UserPlus size={32} className="text-white" strokeWidth={1.5} />
          </div>

          {/* Contenido */}
          <div className="flex-1 px-8 py-8 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">
                Empresa existente
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#111] leading-tight">
                Unirme a Equipo
              </h2>
            </div>
            <p className="text-[11px] font-bold text-[#666] uppercase tracking-wider leading-relaxed max-w-sm">
              Busca una empresa ya existente en la red mediante su CUIT para
              colaborar como miembro operativo.
            </p>
          </div>

          {/* Flecha */}
          <div className="w-16 shrink-0 border-l-2 border-[#111] flex items-center justify-center bg-emerald-50">
            <ArrowRight
              size={18}
              className="text-emerald-700"
              strokeWidth={2.5}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
