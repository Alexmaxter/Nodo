import { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Plus,
  Check,
  Clock,
  AlertCircle,
  Building2,
  ArrowRight,
  Wifi,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ── Badge de estado ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === "accepted")
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border-emerald-300">
        <Check size={10} strokeWidth={3} /> Conectado
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border-amber-300">
        <Clock size={10} strokeWidth={2.5} /> Pendiente
      </span>
    );
  return null;
}

// ── Tarjeta de proveedor ──────────────────────────────────────────────────────
function ProviderCard({ provider, status, processingId, onConnect, onOpen }) {
  const initials = provider.legal_name.substring(0, 2).toUpperCase();
  const isProcessing = processingId === provider.id;

  return (
    <div className="bg-white border border-[#111] flex flex-col h-full">
      {/* Head */}
      <div className="px-4 py-3 border-b border-[#111] flex items-center justify-between bg-blue-100">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0 bg-[#111] text-white"
            style={{ width: 28, height: 28, fontSize: 10, fontWeight: 800 }}
          >
            {initials}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-900">
            Proveedor
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-[13px] font-black text-[#111] uppercase tracking-[0.06em] leading-snug line-clamp-2">
          {provider.legal_name}
        </h3>
        <p className="text-[10px] font-bold text-[#999] tracking-widest uppercase font-mono">
          CUIT {provider.tax_id}
        </p>
      </div>

      {/* Footer acción */}
      <div className="border-t border-[#111] shrink-0">
        {!status ? (
          <button
            onClick={() => onConnect(provider.id)}
            disabled={isProcessing}
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#111] text-white text-[10px] font-black uppercase tracking-[0.14em] disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Plus size={13} strokeWidth={2.5} />
            )}
            {isProcessing ? "Procesando..." : "Solicitar conexión"}
          </button>
        ) : status === "pending" ? (
          <div className="w-full h-10 flex items-center justify-center gap-2 bg-amber-50">
            <Clock size={12} className="text-amber-700" strokeWidth={2.5} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-800">
              Esperando respuesta
            </span>
          </div>
        ) : (
          <button
            onClick={() => onOpen(provider.id)}
            className="w-full h-10 flex items-center justify-center gap-2 bg-white text-[#111] text-[10px] font-black uppercase tracking-[0.14em]"
          >
            Abrir cuenta
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function NetworkDirectory() {
  const navigate = useNavigate();
  const { company, loading: authLoading } = useAuth();

  const [searchResults, setSearchResults] = useState([]);
  const [myRelationships, setMyRelationships] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMyRelationships() {
      if (!company?.id) return;
      try {
        const { data: rels, error: rError } = await supabase
          .from("relationships")
          .select("provider_id, status")
          .eq("merchant_id", company.id);
        if (rError) throw rError;
        if (isMounted) {
          const map = {};
          rels?.forEach((r) => {
            map[r.provider_id] = r.status;
          });
          setMyRelationships(map);
        }
      } catch (err) {
        console.error("[NetworkDirectory] Error:", err.message);
      }
    }
    fetchMyRelationships();
    return () => {
      isMounted = false;
    };
  }, [company]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const { data: providers, error: searchError } = await supabase
        .from("companies")
        .select("id, legal_name, tax_id")
        .eq("is_provider", true)
        .neq("id", company.id)
        .or(`tax_id.ilike.%${searchTerm}%,legal_name.ilike.%${searchTerm}%`)
        .limit(10);
      if (searchError) throw searchError;
      setSearchResults(providers || []);
    } catch (err) {
      console.error("[NetworkDirectory] Error en búsqueda:", err.message);
      setError("Hubo un problema al realizar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleConnect = async (providerId) => {
    setProcessingId(providerId);
    setError(null);
    try {
      const { error: connectError } = await supabase
        .from("relationships")
        .insert([
          {
            merchant_id: company.id,
            provider_id: providerId,
            status: "pending",
          },
        ]);
      if (connectError) throw connectError;
      setMyRelationships((prev) => ({ ...prev, [providerId]: "pending" }));
    } catch (err) {
      console.error("[NetworkDirectory] Error al conectar:", err.message);
      setError("No se pudo enviar la solicitud de conexión.");
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
        <Wifi size={24} className="text-[#ccc]" strokeWidth={1.5} />
        <p className="text-[11px] font-bold text-[#bbb] uppercase tracking-[0.2em]">
          Conectando a la red...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      {/* ── ENCABEZADO discreto pero presente ── */}
      <div className="flex items-center justify-between border-b border-[#111] pb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-9 h-9 border border-[#111] bg-blue-100 shrink-0">
            <Building2 size={16} className="text-blue-900" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[13px] font-black uppercase tracking-[0.12em] text-[#111] leading-none">
              Directorio de Proveedores
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mt-1.5">
              Buscá por CUIT o razón social
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 border border-[#111] bg-blue-100">
            <span className="text-[18px] font-black leading-none text-blue-900">
              {Object.keys(myRelationships).length}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Conexiones
            </span>
          </div>
        </div>
      </div>

      {/* ── BARRA DE BÚSQUEDA ── */}
      <form
        onSubmit={handleSearch}
        className="w-full flex flex-col sm:flex-row border border-[#111]"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bbb]"
            size={14}
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Ej: 30-12345678-9 o 'Fábrica S.A.'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white pl-10 pr-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#111] placeholder:text-[#ccc] placeholder:font-medium focus:outline-none border-b sm:border-b-0 sm:border-r border-[#111]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          className="h-12 px-7 flex items-center justify-center gap-2 bg-[#111] text-white text-[10px] font-black uppercase tracking-[0.14em] shrink-0 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <>
              <Search size={13} strokeWidth={2.5} />
              Buscar
            </>
          )}
        </button>
      </form>

      {/* ── ERROR ── */}
      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3 border border-[#111]"
          style={{ background: "var(--nodo-danger-body)" }}
        >
          <AlertCircle
            size={13}
            strokeWidth={2}
            style={{
              color: "var(--nodo-danger-text)",
              flexShrink: 0,
              marginTop: 1,
            }}
          />
          <p
            className="text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--nodo-danger-text)" }}
          >
            {error}
          </p>
        </div>
      )}

      {/* ── SIN RESULTADOS ── */}
      {hasSearched && !loading && searchResults.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 border border-dashed border-[#ccc]"
          style={{ background: "var(--nodo-surface-body)" }}
        >
          <Search size={28} className="text-[#ccc] mb-4" strokeWidth={1.5} />
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-[#111] mb-1">
            Sin resultados
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">
            Revisá el CUIT o la razón social ingresada.
          </p>
        </div>
      )}

      {/* ── RESULTADOS ── */}
      {searchResults.length > 0 && (
        <>
          {/* Sub-encabezado de resultados */}
          <div className="flex items-center justify-between border-b border-dashed border-[#e5e5e5] pb-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#444]">
                Resultados
              </span>
              <span className="px-2 py-0.5 border border-[#111] text-[9px] font-black uppercase tracking-wider bg-zinc-50 text-[#666]">
                {searchResults.length} empresa
                {searchResults.length !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]">
              Seleccioná un proveedor para conectarte
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchResults.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                status={myRelationships[provider.id]}
                processingId={processingId}
                onConnect={handleConnect}
                onOpen={(id) => navigate(`/panel/proveedor/${id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── ESTADO INICIAL ── */}
      {!hasSearched && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Wifi size={28} strokeWidth={1.2} className="text-[#ddd]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccc]">
            Ingresá un término para buscar
          </p>
        </div>
      )}
    </div>
  );
}
