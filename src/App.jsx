import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./shared/layouts/MainLayout";
import NetworkDirectory from "./features/network/components/NetworkDirectory";
import NewInvoice from "./features/invoices/components/NewInvoice";
import Login from "./features/auth/components/Login";
import Register from "./features/auth/components/Register";
import SupplierList from "./features/invoices/components/SupplierList";
import ClientList from "./features/invoices/components/ClientList";
import AccountDetail from "./features/invoices/components/AccountDetail";
import Settings from "./features/settings/components/settings";
import CreateOrderView from "./features/orders/components/CreateOrderView";
import CompanyDetail from "./features/dashboard/components/CompanyDetail";
import OnboardingView from "./features/onboarding/components/OnboardingView";
import NewOperation from "./features/dashboard/components/NewOperation";
import CatalogView from "./features/catalog/components/CatalogView";
import IncomingOrders from "./features/orders/components/IncomingOrders";
import RoleManagement from "./features/settings/components/RoleManagement";
import OrderList from "./features/catalog/components/OrderLisr";
// IMPORTAMOS EL DASHBOARD
import Dashboard from "./features/dashboard/components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Autenticación) */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Paso intermedio al registrarse */}
        <Route path="/onboarding" element={<OnboardingView />} />

        {/* Rutas Privadas (El Panel) */}
        <Route path="/panel" element={<MainLayout />}>
          {/* Vistas Generales */}
          <Route index element={<Dashboard />} />{" "}
          {/* <-- AHORA EL DASHBOARD ES EL INICIO */}
          <Route path="proveedores" element={<SupplierList />} />{" "}
          {/* <-- MOVIDO AQUI */}
          <Route path="clientes" element={<ClientList />} />
          <Route path="red" element={<NetworkDirectory />} />
          <Route path="nueva-factura" element={<NewInvoice />} />
          <Route path="catalog" element={<CatalogView />} />
          <Route path="ajustes" element={<Settings />} />
          {/* Vistas en Detalle (Libro Mayor) */}
          <Route path="pedidos" element={<OrderList />} />
          <Route path="proveedor/:id" element={<CompanyDetail />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="cliente/:id" element={<CompanyDetail />} />
          <Route
            path="proveedor/:id/nuevo-pedido"
            element={<CreateOrderView />}
          />
          <Route path="pedidos-recibidos" element={<IncomingOrders />} />
          {/* Flujo de Nuevas Operaciones */}
          <Route
            path="proveedor/:id/nueva-operacion"
            element={<NewOperation />}
          />
          <Route
            path="cliente/:id/nueva-operacion"
            element={<NewOperation />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
