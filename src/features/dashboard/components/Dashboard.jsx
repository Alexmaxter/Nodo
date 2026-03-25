import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import {
  Users,
  Store,
  FileText,
  TrendingUp,
  ShoppingCart,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart2,
  Activity,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount);
}

const STATUS_CFG = {
  PENDING: {
    label: "Pendiente",
    Icon: AlertCircle,
    cls: "text-amber-700 bg-amber-50 border-amber-300",
  },
  APPROVED: {
    label: "Aprobado",
    Icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 border-emerald-300",
  },
  REJECTED: {
    label: "Rechazado",
    Icon: XCircle,
    cls: "text-red-600 bg-red-50 border-red-300",
  },
  approved: {
    label: "Activo",
    Icon: CheckCircle2,
    cls: "text-emerald-700 bg-emerald-50 border-emerald-300",
  },
  pending: {
    label: "Pendiente",
    Icon: AlertCircle,
    cls: "text-amber-700 bg-amber-50 border-amber-300",
  },
  rejected: {
    label: "Rechazado",
    Icon: XCircle,
    cls: "text-red-600 bg-red-50 border-red-300",
  },
};

const TYPE_LABELS = {
  INVOICE: "Factura",
  RECEIPT: "Recibo",
  CREDIT_NOTE: "Nota de Crédito",
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? {
    label: status,
    Icon: AlertCircle,
    cls: "text-gray-500 bg-gray-50 border-gray-200",
  };
  const { Icon } = cfg;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider ${cfg.cls}`}
    >
      <Icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-100 border border-gray-200 shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-2.5 bg-gray-100 w-3/4" />
        <div className="h-2 bg-gray-100 w-1/2" />
      </div>
      <div className="h-5 w-16 bg-gray-100" />
    </div>
  );
}

// ── Bloque de sección ─────────────────────────────────────────────────────────

function Section({ title, icon: Icon, accentBg, accentText, children }) {
  return (
    <div className="bg-white border border-[#111] flex flex-col">
      <div
        className={`px-4 py-3 border-b border-[#111] flex items-center gap-2 ${accentBg}`}
      >
        <Icon size={13} className={accentText} strokeWidth={2.5} />
        <span
          className={`text-[10px] font-black uppercase tracking-[0.15em] ${accentText}`}
        >
          {title}
        </span>
      </div>
      <div className="divide-y divide-dashed divide-[#e5e5e5]">{children}</div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <Activity size={20} className="text-[#ccc]" />
      <p className="text-[11px] font-bold text-[#bbb] uppercase tracking-widest text-center">
        {message}
      </p>
    </div>
  );
}

// ── Últimas Transacciones ─────────────────────────────────────────────────────

function RecentTransactions({ companyId, isMerchantMode }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;

    (async () => {
      if (isMounted) setLoading(true);
      try {
        const field = isMerchantMode ? "merchant_id" : "provider_id";
        const { data } = await supabase
          .from("transactions")
          .select(
            `id, type, amount, status, created_at,
             provider:provider_id ( legal_name ),
             merchant:merchant_id ( legal_name )`,
          )
          .eq(field, companyId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (isMounted) setRows(data ?? []);
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [companyId, isMerchantMode]);

  const counterpart = (row) =>
    isMerchantMode ? row.provider?.legal_name : row.merchant?.legal_name;

  return (
    <Section
      title={
        isMerchantMode
          ? "Últimas Órdenes Emitidas"
          : "Últimas Facturas Recibidas"
      }
      icon={isMerchantMode ? ShoppingCart : FileText}
      accentBg={isMerchantMode ? "bg-amber-100" : "bg-violet-100"}
      accentText={isMerchantMode ? "text-amber-900" : "text-violet-900"}
    >
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="px-4">
            <SkeletonRow />
          </div>
        ))
      ) : rows.length === 0 ? (
        <EmptyState message="Sin transacciones recientes" />
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center border border-[#111] shrink-0 ${
                isMerchantMode ? "bg-amber-50" : "bg-violet-50"
              }`}
            >
              {isMerchantMode ? (
                <ArrowUpRight
                  size={13}
                  className="text-amber-700"
                  strokeWidth={2.5}
                />
              ) : (
                <ArrowDownLeft
                  size={13}
                  className="text-violet-700"
                  strokeWidth={2.5}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111] truncate">
                {TYPE_LABELS[row.type] ?? row.type}
                {counterpart(row) && (
                  <span className="font-normal text-[#666]">
                    {" "}
                    · {counterpart(row)}
                  </span>
                )}
              </p>
              <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider mt-0.5">
                {formatDate(row.created_at)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[12px] font-black text-[#111]">
                {formatAmount(row.amount)}
              </span>
              <StatusBadge status={row.status} />
            </div>
          </div>
        ))
      )}
    </Section>
  );
}

// ── Últimas Relaciones ────────────────────────────────────────────────────────

function RecentRelationships({ companyId, isMerchantMode }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;

    (async () => {
      if (isMounted) setLoading(true);
      try {
        const field = isMerchantMode ? "merchant_id" : "provider_id";
        const { data } = await supabase
          .from("relationships")
          .select(
            `id, status, created_at,
             provider:provider_id ( legal_name ),
             merchant:merchant_id ( legal_name )`,
          )
          .eq(field, companyId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (isMounted) setRows(data ?? []);
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [companyId, isMerchantMode]);

  const counterpart = (row) =>
    isMerchantMode ? row.provider?.legal_name : row.merchant?.legal_name;

  return (
    <Section
      title={isMerchantMode ? "Proveedores Recientes" : "Clientes Recientes"}
      icon={isMerchantMode ? Store : Users}
      accentBg={isMerchantMode ? "bg-blue-100" : "bg-indigo-100"}
      accentText={isMerchantMode ? "text-blue-900" : "text-indigo-900"}
    >
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="px-4">
            <SkeletonRow />
          </div>
        ))
      ) : rows.length === 0 ? (
        <EmptyState
          message={isMerchantMode ? "Sin proveedores aún" : "Sin clientes aún"}
        />
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center border border-[#111] shrink-0 ${
                isMerchantMode ? "bg-blue-50" : "bg-indigo-50"
              }`}
            >
              {isMerchantMode ? (
                <Store size={13} className="text-blue-700" strokeWidth={2.5} />
              ) : (
                <Users
                  size={13}
                  className="text-indigo-700"
                  strokeWidth={2.5}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111] truncate">
                {counterpart(row) ?? "—"}
              </p>
              <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider mt-0.5">
                Desde {formatDate(row.created_at)}
              </p>
            </div>
            <StatusBadge status={row.status} />
          </div>
        ))
      )}
    </Section>
  );
}

// ── Notificaciones recientes ──────────────────────────────────────────────────

function RecentNotifications({ profileId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    let isMounted = true;

    (async () => {
      if (isMounted) setLoading(true);
      try {
        const { data } = await supabase
          .from("notifications")
          .select("id, title, content, type, is_read, created_at, link")
          .eq("profile_id", profileId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (isMounted) setRows(data ?? []);
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  const unread = rows.filter((r) => !r.is_read).length;

  return (
    <Section
      title={`Notificaciones${unread > 0 ? ` · ${unread} sin leer` : ""}`}
      icon={Bell}
      accentBg="bg-rose-100"
      accentText="text-rose-900"
    >
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="px-4">
            <SkeletonRow />
          </div>
        ))
      ) : rows.length === 0 ? (
        <EmptyState message="Sin notificaciones" />
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
              !row.is_read ? "bg-rose-50/40" : ""
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center border border-[#111] shrink-0 mt-0.5 ${
                !row.is_read ? "bg-rose-100" : "bg-gray-50"
              }`}
            >
              <Bell
                size={13}
                className={!row.is_read ? "text-rose-700" : "text-gray-400"}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={`text-[12px] truncate ${
                    !row.is_read
                      ? "font-black text-[#111]"
                      : "font-bold text-[#444]"
                  }`}
                >
                  {row.title}
                </p>
                {!row.is_read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                )}
              </div>
              {row.content && (
                <p className="text-[11px] font-medium text-[#777] mt-0.5 truncate">
                  {row.content}
                </p>
              )}
              <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider mt-0.5">
                {formatDate(row.created_at)}
              </p>
            </div>
          </div>
        ))
      )}
    </Section>
  );
}

// ── Productos con bajo stock ──────────────────────────────────────────────────

function LowStockProducts({ companyId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;

    (async () => {
      if (isMounted) setLoading(true);
      try {
        const { data } = await supabase
          .from("products")
          .select("id, name, sku, price, stock")
          .eq("company_id", companyId)
          .order("stock", { ascending: true })
          .limit(5);

        if (isMounted) setRows(data ?? []);
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const stockCls = (stock) => {
    if (stock === 0) return "text-red-600 bg-red-50 border-red-300";
    if (stock <= 5) return "text-amber-600 bg-amber-50 border-amber-300";
    return "text-emerald-600 bg-emerald-50 border-emerald-300";
  };

  return (
    <Section
      title="Stock de Productos"
      icon={Package}
      accentBg="bg-emerald-100"
      accentText="text-emerald-900"
    >
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="px-4">
            <SkeletonRow />
          </div>
        ))
      ) : rows.length === 0 ? (
        <EmptyState message="Sin productos registrados" />
      ) : (
        rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center border border-[#111] bg-emerald-50 shrink-0">
              <Package
                size={13}
                className="text-emerald-700"
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#111] truncate">
                {row.name}
              </p>
              <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider mt-0.5">
                {row.sku ? `SKU: ${row.sku}` : "Sin SKU"} ·{" "}
                {formatAmount(row.price)}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider ${stockCls(row.stock)}`}
            >
              {row.stock} u.
            </span>
          </div>
        ))
      )}
    </Section>
  );
}
// ── Movimientos de Inventario ─────────────────────────────────────────────────

function RecentInventoryMovements({ companyId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;

    (async () => {
      if (isMounted) setLoading(true);
      try {
        const { data } = await supabase
          .from("inventory_movements")
          .select(
            `id, type, quantity, created_at,
             product:product_id ( name, company_id )`,
          )
          .order("created_at", { ascending: false })
          .limit(20);

        const filtered = (data ?? []).filter(
          (m) => m.product?.company_id === companyId,
        );

        if (isMounted) setRows(filtered.slice(0, 5));
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const MOV_CFG = {
    SALE: {
      label: "Venta",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-300",
      sign: "-",
    },
    RESTOCK: {
      label: "Reposición",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-300",
      sign: "+",
    },
    ADJUSTMENT: {
      label: "Ajuste",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-300",
      sign: "±",
    },
    RETURN: {
      label: "Devolución",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-300",
      sign: "+",
    },
  };

  return (
    <Section
      title="Movimientos de Inventario"
      icon={BarChart2}
      accentBg="bg-sky-100"
      accentText="text-sky-900"
    >
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="px-4">
            <SkeletonRow />
          </div>
        ))
      ) : rows.length === 0 ? (
        <EmptyState message="Sin movimientos registrados" />
      ) : (
        rows.map((row) => {
          const cfg = MOV_CFG[row.type] ?? {
            label: row.type,
            bg: "bg-gray-50",
            text: "text-gray-600",
            border: "border-gray-200",
            sign: "",
          };
          return (
            <div
              key={row.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center border border-[#111] shrink-0 ${cfg.bg}`}
              >
                <BarChart2 size={13} className={cfg.text} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#111] truncate">
                  {row.product?.name ?? "Producto eliminado"}
                </p>
                <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider mt-0.5">
                  {formatDate(row.created_at)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[12px] font-black ${cfg.text}`}>
                  {cfg.sign}
                  {row.quantity} u.
                </span>
                <span
                  className={`inline-flex px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider ${cfg.text} ${cfg.bg} ${cfg.border}`}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })
      )}
    </Section>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────

export default function Dashboard() {
  const { company, user } = useAuth();
  const context = useOutletContext();
  const isMerchantMode = context?.isMerchantMode ?? true;

  const [stats, setStats] = useState({
    proveedores: 0,
    pedidos: 0,
    clientes: 0,
    facturas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!company?.id) return;
      if (isMounted) setLoading(true);

      try {
        const [
          { count: proveedoresCount },
          { count: pedidosCount },
          { count: clientesCount },
          { count: facturasCount },
        ] = await Promise.all([
          supabase
            .from("relationships")
            .select("*", { count: "exact", head: true })
            .eq("merchant_id", company.id)
            .eq("status", "approved"),
          supabase
            .from("transactions")
            .select("*", { count: "exact", head: true })
            .eq("merchant_id", company.id)
            .eq("type", "INVOICE"),
          supabase
            .from("relationships")
            .select("*", { count: "exact", head: true })
            .eq("provider_id", company.id)
            .eq("status", "approved"),
          supabase
            .from("transactions")
            .select("*", { count: "exact", head: true })
            .eq("provider_id", company.id)
            .eq("type", "INVOICE"),
        ]);

        if (isMounted) {
          setStats({
            proveedores: proveedoresCount || 0,
            pedidos: pedidosCount || 0,
            clientes: clientesCount || 0,
            facturas: facturasCount || 0,
          });
        }
      } catch (error) {
        if (isMounted) console.error("Error cargando métricas:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [company]);

  if (!company) return null;

  const metrics = isMerchantMode
    ? [
        {
          label: "Proveedores Activos",
          value: stats.proveedores,
          icon: Store,
          trend: "Conexiones en red",
          colors: {
            bg: "bg-blue-100",
            text: "text-blue-900",
            hover: "hover:bg-blue-50",
          },
        },
        {
          label: "Órdenes Emitidas",
          value: stats.pedidos,
          icon: ShoppingCart,
          trend: "Historial de compras",
          colors: {
            bg: "bg-amber-100",
            text: "text-amber-900",
            hover: "hover:bg-amber-50",
          },
        },
        {
          label: "Gasto Estimado",
          value: "$0.00",
          icon: TrendingUp,
          trend: "Módulo financiero próximamente",
          colors: {
            bg: "bg-emerald-100",
            text: "text-emerald-900",
            hover: "hover:bg-emerald-50",
          },
        },
      ]
    : [
        {
          label: "Clientes Activos",
          value: stats.clientes,
          icon: Users,
          trend: "Conexiones en red",
          colors: {
            bg: "bg-indigo-100",
            text: "text-indigo-900",
            hover: "hover:bg-indigo-50",
          },
        },
        {
          label: "Facturas Emitidas",
          value: stats.facturas,
          icon: FileText,
          trend: "Historial de ventas",
          colors: {
            bg: "bg-violet-100",
            text: "text-violet-900",
            hover: "hover:bg-violet-50",
          },
        },
        {
          label: "Ingreso Estimado",
          value: "$0.00",
          icon: TrendingUp,
          trend: "Módulo financiero próximamente",
          colors: {
            bg: "bg-emerald-100",
            text: "text-emerald-900",
            hover: "hover:bg-emerald-50",
          },
        },
      ];

  return (
    <div className="w-full flex flex-col gap-10 animate-in fade-in duration-300 pb-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-[#111]">
          Hola, {company.legal_name}
        </h1>
        <p className="text-[12px] font-bold text-[#666] uppercase tracking-[0.1em]">
          Resumen de actividad en modo{" "}
          <strong className="text-[#111]">
            {isMerchantMode ? "Comerciante" : "Proveedor"}
          </strong>
          .
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className={`bg-white border border-[#111] flex flex-col transition-colors duration-200 cursor-default ${metric.colors.hover}`}
            >
              <div
                className={`p-4 border-b border-[#111] flex items-center justify-between ${metric.colors.bg}`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.15em] ${metric.colors.text}`}
                >
                  {metric.label}
                </span>
                <div className="w-8 h-8 bg-white flex items-center justify-center border border-[#111]">
                  <Icon
                    size={14}
                    className={metric.colors.text}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <Loader2
                    className="animate-spin text-[#111] mt-2 mb-1"
                    size={28}
                  />
                ) : (
                  <h3 className="text-4xl font-black tracking-tighter text-[#111]">
                    {metric.value}
                  </h3>
                )}
                <p className="text-[11px] font-bold text-[#666] uppercase tracking-widest mt-2">
                  {metric.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Actividad Reciente ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-dashed border-[#ddd] pb-3">
          <Clock size={13} className="text-[#666]" strokeWidth={2.5} />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#666]">
            Actividad Reciente
          </h2>
        </div>

        {/* Fila 1: Transacciones + Relaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions
            companyId={company.id}
            isMerchantMode={isMerchantMode}
          />
          <RecentRelationships
            companyId={company.id}
            isMerchantMode={isMerchantMode}
          />
        </div>

        {/* Fila 2: Notificaciones + Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentNotifications profileId={user?.id} />
          <LowStockProducts companyId={company.id} />
        </div>

        {/* Fila 3: Movimientos de inventario — ancho completo */}
        <RecentInventoryMovements companyId={company.id} />
      </div>
    </div>
  );
}
