import { useEffect, useState } from "react";
import { Store, Clock, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

// Sub-componentes
import SupplierActionBar from "./SupplierActionBar";
import SupplierActiveCard from "./SupplierActiveCard";

export default function SupplierList() {
  const { company, loading: authLoading } = useAuth();

  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRelationships = async () => {
      if (authLoading) return;
      if (!company?.id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const { data: relData, error: relError } = await supabase
          .from("relationships")
          .select(`id, status, supplier:provider_id (id, legal_name, tax_id)`)
          .eq("merchant_id", company.id)
          .neq("status", "rejected");

        if (relError) throw relError;

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("provider_id, type, amount")
          .eq("merchant_id", company.id);

        if (txError) throw txError;

        const balances = {};
        if (txData) {
          txData.forEach((tx) => {
            if (!balances[tx.provider_id]) balances[tx.provider_id] = 0;
            if (tx.type === "INVOICE")
              balances[tx.provider_id] += Number(tx.amount);
            if (tx.type === "RECEIPT")
              balances[tx.provider_id] -= Number(tx.amount);
          });
        }

        const enrichedRels = (relData || []).map((rel) => ({
          ...rel,
          balance: rel.supplier ? balances[rel.supplier.id] || 0 : 0,
        }));

        if (isMounted) setRelationships(enrichedRels);
      } catch (err) {
        console.error("Error al cargar proveedores:", err.message);
        if (isMounted)
          setError("Hubo un problema al cargar la red de proveedores.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRelationships();
    return () => {
      isMounted = false;
    };
  }, [company, authLoading]);

  // Filtrado
  const filteredRels = relationships.filter((rel) => {
    if (!rel.supplier || !rel.supplier.legal_name) return false;
    return rel.supplier.legal_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const pendingSents = filteredRels.filter((r) => r.status === "pending");
  const acceptedSuppliers = filteredRels.filter((r) => r.status === "approved");

  if (authLoading || loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <Store size={32} className="text-[#111] mb-4 animate-pulse" />
        <p className="text-[11px] font-bold text-[#111] uppercase tracking-[0.2em]">
          Cargando Red de Proveedores...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-[#111] text-[#111] flex items-start gap-3">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <p className="text-[12px] font-bold uppercase tracking-widest">
          {error}
        </p>
      </div>
    );
  }

  return (
    // Sin max-w para que ocupe todo el ancho disponible
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Componente Integrado: Barra de Búsqueda */}
      <SupplierActionBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Proveedores Pendientes (Diseño plano) */}
      {pendingSents.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#111] pb-3">
            <Clock size={16} className="text-[#111]" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111]">
              Solicitudes en espera ({pendingSents.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingSents.map((rel) => (
              <div
                key={rel.id}
                className="p-4 border border-[#111] bg-gray-50 flex items-center gap-4"
              >
                <div className="w-8 h-8 bg-white border border-[#111] flex items-center justify-center font-bold text-[10px] text-[#111] uppercase shrink-0">
                  {rel.supplier.legal_name.substring(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111] truncate">
                    {rel.supplier.legal_name}
                  </h3>
                  <p className="text-[9px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1">
                    Pendiente
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Proveedores Activos */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-[#111] pb-3">
          <Store size={16} className="text-[#111]" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111]">
            Proveedores Activos ({acceptedSuppliers.length})
          </h2>
        </div>

        {acceptedSuppliers.length === 0 ? (
          <div className="w-full border border-[#111] py-24 flex flex-col items-center text-center bg-[#fcfcfc]">
            <Store size={48} className="text-[#111] mb-6" strokeWidth={1} />
            <p className="text-[13px] font-black text-[#111] uppercase tracking-[0.2em] mb-2">
              No hay proveedores activos
            </p>
            <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest max-w-sm">
              Usa el buscador para filtrar o agrega un proveedor nuevo a tu red
              operativa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {acceptedSuppliers.map((rel) => (
              // Componente Integrado: Tarjeta Renovada
              <SupplierActiveCard key={rel.id} rel={rel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
