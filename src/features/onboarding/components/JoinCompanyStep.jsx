import { useState, useRef } from "react";
import {
  Search,
  Loader2,
  Building2,
  Fingerprint,
  AlertCircle,
  Send,
  UserPlus,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

const formatCuit = (raw = "") => {
  const d = raw.replace(/[^0-9]/g, "");
  if (d.length === 11)
    return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
  return raw;
};

export default function JoinCompanyStep({ user, onRequested }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [status, setStatus] = useState("idle");
  const [sending, setSending] = useState(false);
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedCompany(null);

    if (!val.trim()) {
      setResults([]);
      setStatus("idle");
      clearTimeout(debounceRef.current);
      return;
    }

    setStatus("searching");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val.trim()), 400);
  };

  const runSearch = async (query) => {
    try {
      const isNumeric = query.replace(/[^0-9]/g, "").length > 0;
      let q = supabase
        .from("companies")
        .select("id, legal_name, tax_id")
        .limit(8);
      if (isNumeric) q = q.ilike("tax_id", `%${query.replace(/[^0-9]/g, "")}%`);
      else q = q.ilike("legal_name", `%${query}%`);

      const { data, error } = await q;
      if (error) throw error;
      setResults(data || []);
      setStatus(data?.length > 0 ? "done" : "empty");
    } catch (err) {
      console.error("Error buscando:", err);
      setStatus("empty");
    }
  };

  const handleSendRequest = async () => {
    if (!selectedCompany) return;
    setSending(true);
    try {
      const { error } = await supabase.from("company_members").insert([
        {
          company_id: selectedCompany.id,
          profile_id: user.id,
          status: "pending",
          role: "member",
        },
      ]);
      if (error) throw error;
      onRequested(selectedCompany);
    } catch (err) {
      console.error("Error enviando solicitud:", err);
      alert("Error al enviar solicitud");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-12">
      {/* Encabezado */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999] block mb-4">
          Empresa Existente
        </span>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-[#111] leading-none">
          Unirme
          <br />a Equipo
        </h1>
      </div>

      {/* Campo de búsqueda */}
      <div className="flex items-stretch border-2 border-[#111]">
        <div className="w-14 shrink-0 bg-emerald-600 border-r-2 border-[#111] flex items-center justify-center">
          <Search size={20} className="text-white" strokeWidth={2} />
        </div>
        <input
          autoFocus
          className="flex-1 bg-white py-5 px-5 outline-none font-bold text-[13px] uppercase tracking-widest text-[#111] placeholder:text-[#ccc]"
          placeholder="CUIT o Razón Social"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {status === "searching" && (
          <div className="w-14 border-l-2 border-[#111] flex items-center justify-center bg-[#f4f4f4]">
            <Loader2 size={16} className="animate-spin text-[#888]" />
          </div>
        )}
      </div>

      {/* Resultados / empresa seleccionada */}
      {!selectedCompany ? (
        <div>
          {status === "done" && (
            <div className="border-2 border-[#111] bg-white flex flex-col divide-y-2 divide-[#111]">
              {results.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c)}
                  className="w-full flex items-stretch text-left cursor-pointer"
                >
                  <div className="w-14 shrink-0 bg-[#f4f4f4] border-r-2 border-[#111] flex items-center justify-center">
                    <Building2
                      size={16}
                      className="text-[#666]"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1 px-6 py-5">
                    <p className="text-[13px] font-black uppercase tracking-tight text-[#111]">
                      {c.legal_name}
                    </p>
                    <p className="text-[10px] font-mono text-[#888] tracking-wider mt-1">
                      {formatCuit(c.tax_id)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {status === "empty" && (
            <div className="border-2 border-[#111] bg-[#fafafa] flex items-stretch">
              <div className="w-14 shrink-0 bg-[#eee] border-r-2 border-[#111] flex items-center justify-center">
                <AlertCircle
                  size={16}
                  className="text-[#999]"
                  strokeWidth={2}
                />
              </div>
              <div className="px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">
                  No se encontraron empresas
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Empresa elegida */}
          <div className="border-2 border-[#111] bg-white flex items-stretch">
            <div className="w-14 shrink-0 bg-emerald-600 border-r-2 border-[#111] flex items-center justify-center">
              <Building2 size={20} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 px-6 py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">
                Empresa seleccionada
              </p>
              <p className="text-[14px] font-black uppercase tracking-tight text-[#111]">
                {selectedCompany.legal_name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Fingerprint
                  size={11}
                  className="text-[#888]"
                  strokeWidth={2}
                />
                <p className="text-[10px] font-mono text-[#666] tracking-wider">
                  {formatCuit(selectedCompany.tax_id)}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSendRequest}
              disabled={sending}
              className="w-full border-2 border-[#111] bg-[#111] text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 py-5 cursor-pointer disabled:opacity-50"
            >
              {sending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} strokeWidth={2.5} /> Solicitar Acceso
                </>
              )}
            </button>
            <button
              onClick={() => setSelectedCompany(null)}
              className="w-full border-2 border-[#111] bg-white text-[#111] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center py-4 cursor-pointer"
            >
              ← Elegir otra empresa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
