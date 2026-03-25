import { useEffect, useState } from "react";
import { Users, Clock, Building2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

// Sub-componentes
import ClientActionBar from "./ClientActionBar";
import ClientPendingCard from "./ClientPendingCard";
import ClientActiveCard from "./ClientActiveCard";

export default function ClientList() {
  const { company, loading: authLoading } = useAuth();

  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async () => {
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
          .select(`id, status, client:merchant_id (id, legal_name, tax_id)`)
          .eq("provider_id", company.id)
          .neq("status", "rejected");

        if (relError) throw relError;

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("merchant_id, type, amount")
          .eq("provider_id", company.id);

        if (txError) throw txError;

        const balances = {};
        if (txData) {
          txData.forEach((tx) => {
            if (!balances[tx.merchant_id]) balances[tx.merchant_id] = 0;
            if (tx.type === "INVOICE")
              balances[tx.merchant_id] += Number(tx.amount);
            if (tx.type === "RECEIPT")
              balances[tx.merchant_id] -= Number(tx.amount);
          });
        }

        const enrichedRels = (relData || []).map((rel) => ({
          ...rel,
          balance: rel.client ? balances[rel.client.id] || 0 : 0,
        }));

        if (isMounted) setRelationships(enrichedRels);
      } catch (err) {
        console.error("Error al cargar clientes:", err.message);
        if (isMounted)
          setError("Hubo un problema al cargar tu cartera de clientes.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClients();
    return () => {
      isMounted = false;
    };
  }, [company, authLoading]);

  const handleUpdateStatus = async (relId, newStatus) => {
    setProcessingId(relId);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from("relationships")
        .update({ status: newStatus })
        .eq("id", relId);

      if (updateError) throw updateError;

      setRelationships((prev) =>
        prev.map((rel) =>
          rel.id === relId ? { ...rel, status: newStatus } : rel,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err.message);
      setError("No se pudo actualizar el estado de la solicitud.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRels = relationships.filter((rel) => {
    if (!rel.client || !rel.client.legal_name) return false;
    return rel.client.legal_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const pendingRequests = filteredRels.filter((r) => r.status === "pending");
  const approvedClients = filteredRels.filter((r) => r.status === "approved");

  if (authLoading || loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <Users size={32} className="text-[#111] mb-4 animate-pulse" />
        <p className="text-[11px] font-bold text-[#111] uppercase tracking-[0.2em]">
          Cargando Clientes...
        </p>
      </div>
    );
  }

  return (
    // Se eliminó max-w para ocupar toda la pantalla
    <div className="w-full flex flex-col gap-10 pb-12 animate-in fade-in duration-300">
      {error && (
        <div className="p-4 bg-red-50 border border-[#111] text-[#111] flex items-start gap-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}

      {/* Componente Integrado: Barra de Búsqueda */}
      <ClientActionBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Solicitudes Pendientes */}
      {pendingRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#111] pb-3">
            <Clock size={16} className="text-[#111]" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111]">
              Nuevas Solicitudes ({pendingRequests.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingRequests.map((rel) => (
              <ClientPendingCard
                key={rel.id}
                rel={rel}
                processingId={processingId}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </section>
      )}

      {/* Clientes Activos */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-[#111] pb-3">
          <Building2 size={16} className="text-[#111]" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#111]">
            Mis Clientes Activos ({approvedClients.length})
          </h2>
        </div>

        {approvedClients.length === 0 ? (
          <div className="w-full border border-[#111] py-24 flex flex-col items-center text-center bg-[#fcfcfc]">
            <Users size={48} className="text-[#111] mb-6" strokeWidth={1} />
            <p className="text-[13px] font-black text-[#111] uppercase tracking-[0.2em] mb-2">
              No tienes clientes registrados
            </p>
            <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest max-w-sm">
              Cuando otros comercios soliciten conectar contigo, aparecerán en
              la sección de pendientes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {approvedClients.map((rel) => (
              <ClientActiveCard key={rel.id} rel={rel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
