import { Shield, ShieldAlert, Check, Minus } from "lucide-react";

export default function RoleManagement() {
  const roles = [
    {
      name: "Administrador",
      icon: ShieldAlert,
      color: "bg-amber-50",
      textColor: "text-amber-900",
      description: "Control total de la cuenta, miembros y ajustes.",
      permissions: [true, true, true, true],
    },
    {
      name: "Miembro",
      icon: Shield,
      color: "bg-slate-50",
      textColor: "text-slate-900",
      description:
        "Puede operar pedidos y facturas, pero no editar la empresa.",
      permissions: [true, true, false, false],
    },
  ];

  const permissionLabels = [
    "Ver Directorio y Catálogo",
    "Emitir Pedidos y Facturas",
    "Invitar y Eliminar Miembros",
    "Modificar Datos Fiscales",
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="bg-white border border-[#111] p-6">
        <h2 className="text-[14px] font-black uppercase tracking-tight text-[#111]">
          Esquema de Permisos
        </h2>
        <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1">
          Visualiza qué acciones puede realizar cada rol dentro de tu entorno de
          trabajo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role, idx) => {
          const Icon = role.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#111] flex flex-col"
            >
              {/* Encabezado Pastel */}
              <div
                className={`p-4 border-b border-[#111] flex items-center gap-3 ${role.color}`}
              >
                <Icon size={16} className={role.textColor} />
                <h3
                  className={`text-[12px] font-black uppercase tracking-widest ${role.textColor}`}
                >
                  Rol: {role.name}
                </h3>
              </div>

              <div className="p-5 border-b border-[#111] bg-[#fafafa]">
                <p className="text-[11px] font-medium text-[#444]">
                  {role.description}
                </p>
              </div>

              <div className="flex flex-col p-5 gap-3">
                {permissionLabels.map((label, pIdx) => (
                  <div key={pIdx} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                      {label}
                    </span>
                    {role.permissions[pIdx] ? (
                      <Check
                        size={14}
                        className="text-emerald-600"
                        strokeWidth={3}
                      />
                    ) : (
                      <Minus
                        size={14}
                        className="text-red-400"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
