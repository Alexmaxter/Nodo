import { useState, useEffect } from "react";
import { Inbox, Loader2, Package, ArrowRight, Check, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function IncomingOrders() {
  const { company } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchIncomingOrders = async () => {
      if (!company?.id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        // Consultamos la tabla buscando facturas recibidas por el proveedor
        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
            id,
            created_at,
            amount,
            status,
            merchant:merchant_id(legal_name)
          `,
          )
          .eq("provider_id", company.id)
          .eq("type", "INVOICE")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (isMounted) setOrders(data || []);
      } catch (error) {
        if (isMounted)
          console.error("Error al cargar pedidos recibidos:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchIncomingOrders();

    return () => {
      isMounted = false;
    };
  }, [company]);

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Barra de Título Simple */}
      <div className="flex flex-col mb-8 border-b border-[#111] pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-[#111] flex items-center gap-3">
          <Inbox size={24} strokeWidth={2} /> Pedidos Recibidos
        </h1>
        <p className="text-[11px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1">
          Gestiona las solicitudes de compra de tus clientes.
        </p>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-[#111]">
          <Loader2 className="animate-spin text-[#111] mb-4" size={32} />
          <p className="text-[11px] font-bold text-[#111] uppercase tracking-[0.2em]">
            Cargando bandeja de entrada...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-24 bg-[#fcfcfc] border border-[#111]">
          <Inbox className="text-[#ccc] mb-4" size={48} strokeWidth={1.5} />
          <p className="text-[12px] font-black text-[#111] uppercase tracking-widest text-center">
            Bandeja vacía
          </p>
          <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest mt-2">
            No tienes pedidos pendientes por revisar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#111] p-0 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-[#fafafa]"
            >
              {/* Info del pedido */}
              <div className="p-5 flex-1 border-b md:border-b-0 md:border-r border-[#111]">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={16} className="text-[#111]" />
                  <h3 className="text-[14px] font-black uppercase tracking-tight text-[#111]">
                    {order.merchant?.legal_name || "Cliente Desconocido"}
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
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest font-mono">
                  ID: {order.id.split("-")[0]} • Recibido el:{" "}
                  {new Date(order.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>

              {/* Monto y Acciones */}
              <div className="p-5 flex items-center justify-between md:justify-end gap-6 bg-gray-50 md:bg-transparent">
                <span className="text-xl font-mono font-black text-[#111]">
                  ${order.amount?.toFixed(2) || "0.00"}
                </span>
                <div className="flex gap-2">
                  <button
                    title="Aprobar Pedido"
                    className="p-3 bg-white border border-[#111] text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button
                    title="Rechazar Pedido"
                    className="p-3 bg-white border border-[#111] text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  <button
                    title="Ver Detalles"
                    className="p-3 bg-[#111] border border-[#111] text-white hover:bg-[#333] transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
