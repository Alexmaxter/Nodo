import { useState, useEffect } from "react";
import { Clock, Plus, Loader2, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function OrderList() {
  const navigate = useNavigate();
  const { company } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!company?.id) return;

      try {
        // Consultamos la tabla transactions buscando facturas emitidas por el comerciante
        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
            id,
            created_at,
            amount,
            status,
            provider:provider_id(legal_name)
          `,
          )
          .eq("merchant_id", company.id)
          .eq("type", "INVOICE")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [company]);

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Barra de Acciones */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/panel/proveedores")}
          className="flex items-center justify-center gap-2 py-3 px-6 bg-[#111] text-white hover:bg-[#333] transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Nuevo Pedido
          </span>
        </button>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-[#111]">
          <Loader2 className="animate-spin text-[#111] mb-4" size={32} />
          <p className="text-[11px] font-bold text-[#111] uppercase tracking-[0.2em]">
            Cargando historial...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-[#111]">
          <Clock className="text-[#888] mb-4" size={48} />
          <p className="text-[12px] font-bold text-[#111] uppercase tracking-widest text-center mb-6">
            Aún no tienes pedidos registrados
          </p>
          <button
            onClick={() => navigate("/panel/proveedores")}
            className="px-6 py-2 border border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Explorar Proveedores
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#111] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#fafafa]"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package size={16} className="text-[#111]" />
                  <h3 className="text-[14px] font-black uppercase tracking-tight text-[#111]">
                    {order.provider?.legal_name || "Proveedor Desconocido"}
                  </h3>
                  <span
                    className={`px-2 py-1 border border-[#111] text-[9px] font-bold uppercase tracking-widest ${
                      order.status === "PENDING"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-[#f4f4f4] text-[#111]"
                    }`}
                  >
                    {order.status === "PENDING" ? "Pendiente" : order.status}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-[#666] uppercase tracking-widest">
                  ID: {order.id.split("-")[0]} • Fecha:{" "}
                  {new Date(order.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xl font-black text-[#111]">
                  ${order.amount?.toFixed(2) || "0.00"}
                </span>
                <button
                  title="Ver Detalles"
                  className="p-3 bg-white border border-[#111] hover:bg-[#111] hover:text-white transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
