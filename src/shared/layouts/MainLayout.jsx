import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function MainLayout() {
  const { company, loading, user, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeView, setActiveView] = useState("comerciante");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMerchant = !!company?.is_merchant;
  const isProvider = !!company?.is_provider;
  const hasBothRoles = isMerchant && isProvider;
  const isMerchantMode = activeView === "comerciante";

  // En mobile arranca colapsado
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) setSidebarOpen(false);
    const handler = (e) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Cierra el sidebar al navegar en mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) setSidebarOpen(false);
  }, [location.pathname]);

  // Redirecciones
  useEffect(() => {
    if (!loading && !error) {
      if (!user) navigate("/");
      else if (!company) navigate("/onboarding");
    }
  }, [user, company, loading, error, navigate]);

  // Lógica de rol único
  useEffect(() => {
    if (isMerchant && !isProvider) setActiveView("comerciante");
    else if (isProvider && !isMerchant) setActiveView("proveedor");
  }, [company, isMerchant, isProvider]);

  const toggleView = () => {
    setActiveView((prev) =>
      prev === "comerciante" ? "proveedor" : "comerciante",
    );
  };

  // ── Pantalla de carga ──────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-[12px] font-bold tracking-[0.16em] uppercase text-[#111]">
        Cargando...
      </div>
    );
  }

  // ── Pantalla de error ──────────────────────────────────
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-sans p-4">
        <div className="nodo-card nodo-card-danger w-full max-w-[400px]">
          <div className="nodo-card-head">
            <span className="nodo-card-head-label font-bold">
              Error de Conexión
            </span>
          </div>
          <div className="nodo-card-body flex flex-col gap-4">
            <p className="text-[14px] font-bold text-[#111] text-center">
              {error}
            </p>
            <p className="text-[13px] font-medium text-[#444] text-center mb-2">
              No pudimos verificar la información de tu empresa.
            </p>
            <button
              className="nodo-btn-outline font-bold w-full"
              onClick={() => window.location.reload()}
            >
              Reintentar Conexión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !company) return null;

  // ── Layout principal ───────────────────────────────────
  return (
    <div className="min-h-screen flex bg-white font-sans antialiased text-black">
      {/* Overlay — solo en mobile cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed en mobile, estático en desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30
          md:relative md:inset-auto md:z-auto
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
        />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white min-w-0">
        <Header
          company={company}
          hasBothRoles={hasBothRoles}
          activeView={activeView}
          toggleView={toggleView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-[40px] md:py-[36px] bg-[#fcfcfc]">
          <Outlet context={{ activeView, isMerchantMode }} />
        </div>
      </main>
    </div>
  );
}
