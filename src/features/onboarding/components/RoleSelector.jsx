import { Store, Truck, Check } from "lucide-react";

export default function RoleSelector({ roles, onToggleRole }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* TARJETA COMERCIANTE */}
      <button
        type="button"
        onClick={() => onToggleRole("comerciante")}
        className={`w-full text-left border-2 cursor-pointer flex items-stretch ${
          roles.is_merchant
            ? "border-blue-600 bg-white"
            : "border-[#111] bg-white"
        }`}
      >
        {/* Columna ícono */}
        <div
          className={`w-20 shrink-0 flex items-center justify-center border-r-2 ${
            roles.is_merchant
              ? "bg-blue-600 border-blue-600"
              : "bg-[#f4f4f4] border-[#111]"
          }`}
        >
          <Store
            size={28}
            className={roles.is_merchant ? "text-white" : "text-[#888]"}
            strokeWidth={1.5}
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 px-7 py-6 flex flex-col gap-2">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.25em] ${
              roles.is_merchant ? "text-blue-600" : "text-[#999]"
            }`}
          >
            Rol operativo
          </p>
          <h3
            className={`text-xl font-black uppercase tracking-tighter leading-tight ${
              roles.is_merchant ? "text-blue-900" : "text-[#111]"
            }`}
          >
            Comerciante
          </h3>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider leading-relaxed ${
              roles.is_merchant ? "text-blue-600" : "text-[#888]"
            }`}
          >
            Compra insumos, recibe facturas y organiza pagos.
          </p>
        </div>

        {/* Checkbox */}
        <div
          className={`w-14 shrink-0 border-l-2 flex items-center justify-center ${
            roles.is_merchant
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-[#111]"
          }`}
        >
          {roles.is_merchant ? (
            <Check size={20} className="text-white" strokeWidth={3} />
          ) : (
            <div className="w-5 h-5 border-2 border-[#ccc]" />
          )}
        </div>
      </button>

      {/* TARJETA PROVEEDOR */}
      <button
        type="button"
        onClick={() => onToggleRole("proveedor")}
        className={`w-full text-left border-2 cursor-pointer flex items-stretch ${
          roles.is_provider
            ? "border-emerald-600 bg-white"
            : "border-[#111] bg-white"
        }`}
      >
        {/* Columna ícono */}
        <div
          className={`w-20 shrink-0 flex items-center justify-center border-r-2 ${
            roles.is_provider
              ? "bg-emerald-600 border-emerald-600"
              : "bg-[#f4f4f4] border-[#111]"
          }`}
        >
          <Truck
            size={28}
            className={roles.is_provider ? "text-white" : "text-[#888]"}
            strokeWidth={1.5}
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 px-7 py-6 flex flex-col gap-2">
          <p
            className={`text-[10px] font-black uppercase tracking-[0.25em] ${
              roles.is_provider ? "text-emerald-600" : "text-[#999]"
            }`}
          >
            Rol operativo
          </p>
          <h3
            className={`text-xl font-black uppercase tracking-tighter leading-tight ${
              roles.is_provider ? "text-emerald-900" : "text-[#111]"
            }`}
          >
            Proveedor
          </h3>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider leading-relaxed ${
              roles.is_provider ? "text-emerald-600" : "text-[#888]"
            }`}
          >
            Envía remitos, emite facturas y gestiona cobranzas.
          </p>
        </div>

        {/* Checkbox */}
        <div
          className={`w-14 shrink-0 border-l-2 flex items-center justify-center ${
            roles.is_provider
              ? "bg-emerald-600 border-emerald-600"
              : "bg-white border-[#111]"
          }`}
        >
          {roles.is_provider ? (
            <Check size={20} className="text-white" strokeWidth={3} />
          ) : (
            <div className="w-5 h-5 border-2 border-[#ccc]" />
          )}
        </div>
      </button>
    </div>
  );
}
