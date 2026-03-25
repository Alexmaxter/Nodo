import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Settings, LogOut, Menu } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function Header({
  company,
  hasBothRoles,
  activeView,
  toggleView,
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isMerchantMode = activeView === "comerciante";
  const companyInitial = (company?.legal_name || "E").charAt(0);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
      navigate("/");
    }
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/panel/ajustes") return "Ajustes de Cuenta";
    if (p === "/panel/red") return "Directorio de Red";
    if (p === "/panel/clientes") return "Mis Clientes";
    if (p === "/panel/proveedores") return "Mis Proveedores";
    if (p === "/panel/pedidos") return "Mis Pedidos";
    if (p === "/panel/pedidos-recibidos") return "Pedidos Recibidos";
    if (p.includes("/nuevo-pedido")) return "Nuevo Pedido";
    if (p === "/panel/nueva-factura") return "Emitir Factura";
    if (p === "/panel/catalog") return "Gestión de Catálogo";
    if (p.includes("/panel/cliente/") || p.includes("/panel/proveedor/"))
      return "Detalle de Cuenta";
    if (p === "/panel") return "Vista General";
    return "Terminal Operativa";
  };

  return (
    <header className="nodo-topbar bg-white shrink-0">
      {/* Botón hamburguesa — solo mobile */}
      <div className="nodo-topbar-cell md:hidden">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex items-center justify-center bg-transparent border-none cursor-pointer text-[#111] p-1"
        >
          <Menu size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Celda: Título de Vista */}
      <div className="nodo-topbar-cell">
        <div className="flex flex-col justify-center">
          <span className="nodo-topbar-label hidden sm:block">Vista</span>
          <span className="nodo-topbar-value">{getPageTitle()}</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Celda: Botón de Modo (solo si tiene ambos roles) */}
      {hasBothRoles && (
        <div
          className={`nodo-topbar-cell ${
            isMerchantMode
              ? "nodo-topbar-mode-merchant"
              : "nodo-topbar-mode-provider"
          }`}
        >
          <button
            onClick={toggleView}
            title="Cambiar modo operativo"
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0"
          >
            <span
              className={`nodo-mode-dot ${
                isMerchantMode
                  ? "nodo-mode-dot-merchant"
                  : "nodo-mode-dot-provider"
              }`}
            />
            {/* Texto oculto en mobile muy pequeño */}
            <span className="nodo-topbar-value hidden sm:block">
              {isMerchantMode ? "Comerciante" : "Proveedor"}
            </span>
            <RefreshCw
              size={12}
              strokeWidth={2.5}
              className={
                isMerchantMode
                  ? "text-[var(--nodo-merchant-text)]"
                  : "text-[var(--nodo-provider-text)]"
              }
            />
          </button>
        </div>
      )}

      {/* Celda: Perfil + Acciones */}
      <div
        className="nodo-topbar-cell gap-3 sm:gap-4"
        style={{ borderRight: "none" }}
      >
        {/* Avatar + Nombre (nombre oculto en mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="nodo-avatar bg-[#111] text-white flex-shrink-0"
            style={{ width: 30, height: 30, fontSize: 11 }}
          >
            {companyInitial}
          </div>
          <span
            className="nodo-topbar-value hidden sm:block"
            style={{
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {company?.legal_name || "Empresa"}
          </span>
        </div>

        {/* Separador */}
        <div
          className="hidden sm:block"
          style={{
            width: 1,
            height: 24,
            background: "var(--nodo-border-light)",
            flexShrink: 0,
          }}
        />

        {/* Ajustes */}
        <button
          onClick={() => navigate("/panel/ajustes")}
          title="Ajustes"
          className="flex items-center justify-center bg-transparent border-none cursor-pointer p-1 text-[#666] hover:text-[#111]"
        >
          <Settings size={15} strokeWidth={2} />
        </button>

        {/* Cerrar Sesión */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          title="Cerrar Sesión"
          className="flex items-center justify-center bg-transparent border-none cursor-pointer p-1 text-[#dc2626] hover:text-[#9b1c1c]"
        >
          <LogOut size={15} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
