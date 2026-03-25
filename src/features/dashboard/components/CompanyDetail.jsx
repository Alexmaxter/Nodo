import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Plus,
  FileDown,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

function formatAmount(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <Activity size={20} className="text-[#ccc]" />
      <p className="text-[11px] font-bold text-[#bbb] uppercase tracking-widest text-center">
        {message}
      </p>
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company: myCompany, loading: authLoading } = useAuth();

  const [targetCompany, setTargetCompany] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        if (isMounted) setLoading(true);
        const { data: compData, error: compError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (compError) throw compError;
        if (isMounted) setTargetCompany(compData);

        const { data: movData, error: movError } = await supabase
          .from("transactions")
          .select("*")
          .or(
            `and(merchant_id.eq.${myCompany.id},provider_id.eq.${id}),and(merchant_id.eq.${id},provider_id.eq.${myCompany.id})`,
          )
          .order("created_at", { ascending: false });

        if (movError) {
          if (isMounted) setMovements([]);
        } else {
          if (isMounted) setMovements(movData || []);
        }
      } catch (err) {
        if (isMounted) console.error("Error:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!authLoading) {
      if (id && myCompany?.id) {
        fetchData();
      } else {
        if (isMounted) setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [id, myCompany, authLoading]);

  // Se evalúa después del useEffect para evitar errores si no hay datos
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#bbb]">
          Leyendo libro mayor...
        </p>
      </div>
    );
  }

  const totalBalance = movements.reduce((acc, mov) => {
    if (mov.type === "INVOICE") return acc + Number(mov.amount);
    if (mov.type === "RECEIPT") return acc - Number(mov.amount);
    return acc;
  }, 0);

  const balanceConfig =
    totalBalance > 0
      ? {
          bg: "bg-red-100",
          text: "text-red-900",
          sub: "text-red-700",
          label: "Saldo a pagar",
          Icon: TrendingUp,
        }
      : totalBalance < 0
        ? {
            bg: "bg-emerald-100",
            text: "text-emerald-900",
            sub: "text-emerald-700",
            label: "Saldo a favor",
            Icon: TrendingDown,
          }
        : {
            bg: "bg-zinc-100",
            text: "text-zinc-900",
            sub: "text-zinc-500",
            label: "Saldo en cero",
            Icon: Minus,
          };

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      {/* ── 1. ENCABEZADO ── */}
      <div className="flex flex-col md:flex-row items-stretch gap-0 border border-[#111]">
        {/* Info empresa */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-between border-r border-[#111]">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#999] mb-8"
            >
              <ArrowLeft size={13} strokeWidth={2.5} /> Volver
            </button>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#bbb] mb-2">
              Empresa
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#111] mb-3">
              {targetCompany?.legal_name}
            </h1>
            <p className="text-[11px] font-bold text-[#666] uppercase tracking-wider font-mono">
              CUIT: {targetCompany?.tax_id}
            </p>
          </div>
          <div className="mt-8">
            <span className="inline-flex items-center px-2 py-0.5 border border-[#111] text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border-emerald-300">
              Cuenta activa
            </span>
          </div>
        </div>

        {/* Panel de saldo */}
        <div
          className={`w-full md:w-72 flex flex-col justify-center p-8 ${balanceConfig.bg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <balanceConfig.Icon
              size={13}
              className={balanceConfig.sub}
              strokeWidth={2.5}
            />
            <p
              className={`text-[9px] font-black uppercase tracking-[0.18em] ${balanceConfig.sub}`}
            >
              {balanceConfig.label}
            </p>
          </div>
          <h2
            className={`text-4xl font-black tracking-tighter ${balanceConfig.text}`}
          >
            {formatAmount(totalBalance)}
          </h2>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${balanceConfig.sub}`}
          >
            {movements.length} operaciones
          </p>
        </div>
      </div>

      {/* ── 2. ACCIONES ── */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#111] text-white text-[10px] font-black uppercase tracking-[0.14em] border border-[#111]">
          <DollarSign size={13} strokeWidth={2} /> Saldar total
        </button>
        <button
          onClick={() => navigate(`/panel/proveedor/${id}/nueva-operacion`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#111] text-[10px] font-black uppercase tracking-[0.14em] border border-[#111]"
        >
          <Plus size={13} strokeWidth={2} /> Añadir movimiento
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#111] text-[10px] font-black uppercase tracking-[0.14em] border border-[#111]">
          <FileDown size={13} strokeWidth={2} /> Generar PDF
        </button>
      </div>

      {/* ── 3. TABLA DE MOVIMIENTOS ── */}
      <div className="bg-white border border-[#111] flex flex-col">
        {/* Head de sección */}
        <div className="px-4 py-3 border-b border-[#111] flex items-center gap-2 bg-blue-100">
          <FileText size={13} className="text-blue-900" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-900">
            Registro de operaciones
          </span>
          {movements.length > 0 && (
            <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-blue-700">
              {movements.length} movimientos
            </span>
          )}
        </div>

        {movements.length === 0 ? (
          <EmptyState message="No hay movimientos registrados" />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#111] bg-zinc-50">
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-[#999]">
                  Fecha
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-[#999]">
                  Tipo
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-[#999]">
                  Concepto
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-[#999] text-right">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[#e5e5e5]">
              {movements.map((mov) => {
                const isCharge = mov.type === "INVOICE";
                return (
                  <tr key={mov.id} className="hover:bg-zinc-50">
                    <td className="p-4 text-[11px] font-mono text-[#666]">
                      {formatDate(mov.created_at)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider ${
                          isCharge
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {isCharge ? "Factura" : "Pago"}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-[12px] font-bold text-[#111] uppercase tracking-wide">
                        {mov.description || "Movimiento sin descripción"}
                      </p>
                      {mov.reference_number && (
                        <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest mt-0.5">
                          REF: {mov.reference_number}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`text-[13px] font-black font-mono ${
                          isCharge ? "text-red-700" : "text-emerald-700"
                        }`}
                      >
                        {isCharge ? "+" : "-"}
                        {formatAmount(mov.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
