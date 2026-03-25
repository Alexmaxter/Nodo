import { NavLink } from "react-router-dom";
import {
  Store,
  Users,
  FileText,
  Package,
  Link as LinkIcon,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  ShoppingCart,
  Inbox,
} from "lucide-react";

const SIDEBAR_COLLAPSED_W = "w-[64px]";
const SIDEBAR_EXPANDED_W = "w-[240px]";

// Color activo según el modo
const ACTIVE_MERCHANT = {
  bg: "bg-[var(--nodo-merchant-head)]",
  border: "border-[var(--nodo-merchant-action)]",
  text: "text-[var(--nodo-merchant-text)]",
};
const ACTIVE_PROVIDER = {
  bg: "bg-[var(--nodo-provider-head)]",
  border: "border-[var(--nodo-provider-action)]",
  text: "text-[var(--nodo-provider-text)]",
};

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeView }) {
  const isMerchantMode = activeView === "comerciante";
  const active = isMerchantMode ? ACTIVE_MERCHANT : ACTIVE_PROVIDER;

  const menuComerciante = [
    {
      name: "Vista General",
      path: "/panel",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Mis Proveedores",
      path: "/panel/proveedores",
      icon: Store,
      exact: false,
    },
    { name: "Directorio", path: "/panel/red", icon: Users, exact: false },
    {
      name: "Mis Pedidos",
      path: "/panel/pedidos",
      icon: ShoppingCart,
      exact: false,
    },
  ];

  const menuProveedor = [
    {
      name: "Vista General",
      path: "/panel",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Mis Clientes",
      path: "/panel/clientes",
      icon: Users,
      exact: false,
    },
    {
      name: "Pedidos Recibidos",
      path: "/panel/pedidos-recibidos",
      icon: Inbox,
      exact: false,
    },
    {
      name: "Emitir Factura",
      path: "/panel/nueva-factura",
      icon: FileText,
      exact: false,
    },
    { name: "Directorio", path: "/panel/red", icon: LinkIcon, exact: false },
    { name: "Catálogo", path: "/panel/catalog", icon: Package, exact: false },
  ];

  const currentMenu = isMerchantMode ? menuComerciante : menuProveedor;
  const sbWClass = sidebarOpen ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-[#111] shrink-0 overflow-hidden h-screen
        ${sbWClass} transition-all duration-300
      `}
    >
      {/* Cabecera (Logo) */}
      <div
        className={`h-[56px] border-b border-[#111] flex items-center shrink-0 ${
          sidebarOpen ? "px-[20px] justify-start" : "justify-center"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border-[2px] border-[#111] rounded-full flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-[#111] rounded-full" />
          </div>
          {sidebarOpen && (
            <span className="text-[14px] font-bold tracking-[0.25em] uppercase text-[#111] whitespace-nowrap">
              Nodo
            </span>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-[20px] flex flex-col gap-1 overflow-y-auto">
        {sidebarOpen && (
          <p
            className={`px-[20px] pb-3 text-[10px] font-bold tracking-[0.2em] uppercase ${
              isMerchantMode
                ? "text-[var(--nodo-merchant-text)]"
                : "text-[var(--nodo-provider-text)]"
            }`}
          >
            {isMerchantMode ? "Comerciante" : "Proveedor"}
          </p>
        )}

        {currentMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              title={!sidebarOpen ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 py-[12px] text-[12px] no-underline ${
                  sidebarOpen
                    ? "px-[20px] justify-start"
                    : "px-0 justify-center"
                } ${
                  isActive
                    ? `font-bold ${active.bg} ${active.text}`
                    : "text-[#666] font-semibold hover:text-[#111] hover:bg-[#fafafa]"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              {sidebarOpen && (
                <span className="whitespace-nowrap tracking-wide">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pie: Colapsar */}
      <div className="mt-auto border-t border-[#111] shrink-0">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Colapsar menú" : "Expandir menú"}
          className="w-full h-[56px] flex items-center justify-center bg-white hover:bg-[#f4f4f4] cursor-pointer border-none text-[#111]"
        >
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <PanelLeftClose size={18} strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
                Colapsar
              </span>
            </div>
          ) : (
            <PanelLeftOpen size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </aside>
  );
}
