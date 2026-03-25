import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import RoleSelector from "../../onboarding/components/RoleSelector";

export default function GeneralSettings() {
  const { company, refreshCompany } = useAuth();

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    legal_name: "",
    tax_id: "",
    is_merchant: false,
    is_provider: false,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        legal_name: company.legal_name || "",
        tax_id: company.tax_id?.startsWith("TEMP-") ? "" : company.tax_id || "",
        is_merchant: company.is_merchant || false,
        is_provider: company.is_provider || false,
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleToggleRole = (roleType) => {
    const key = roleType === "comerciante" ? "is_merchant" : "is_provider";
    setFormData((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      if (!newState.is_merchant && !newState.is_provider) {
        setStatus({
          type: "error",
          message:
            "Aviso: Debes tener al menos un rol activo para poder guardar.",
        });
      } else {
        setStatus({ type: "", message: "" });
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      if (!formData.legal_name.trim() || !formData.tax_id.trim())
        throw new Error("Razón Social y CUIT son obligatorios.");
      if (!formData.is_merchant && !formData.is_provider)
        throw new Error("Activa al menos un rol operativo para guardar.");

      const { error } = await supabase
        .from("companies")
        .update({
          legal_name: formData.legal_name.trim(),
          tax_id: formData.tax_id.trim(),
          is_merchant: formData.is_merchant,
          is_provider: formData.is_provider,
        })
        .eq("id", company.id);

      if (error) throw error;
      await refreshCompany();
      setStatus({
        type: "success",
        message: "Ajustes guardados correctamente.",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const isSaveDisabled =
    saving || (!formData.is_merchant && !formData.is_provider);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {status.message && (
        <div
          className={`p-4 flex items-center gap-3 border border-[#111] ${status.type === "error" ? "bg-red-50 text-red-900" : "bg-emerald-50 text-emerald-900"}`}
        >
          {status.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <p className="text-[11px] font-bold uppercase tracking-widest">
            {status.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Datos Fiscales (Encabezado Pastel) */}
        <div className="bg-white border border-[#111]">
          <div className="border-b border-[#111] px-6 py-4 bg-slate-50">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">
              Datos Fiscales
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="flex flex-col p-6 border-b md:border-b-0 md:border-r border-[#111]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2">
                Razón Social
              </label>
              <input
                name="legal_name"
                type="text"
                required
                value={formData.legal_name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-[12px] font-bold bg-white border border-[#111] text-[#111] focus:outline-none focus:bg-[#fafafa] uppercase tracking-wider transition-colors rounded-none"
              />
            </div>
            <div className="flex flex-col p-6">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2">
                CUIT / RUT
              </label>
              <input
                name="tax_id"
                type="text"
                required
                value={formData.tax_id}
                onChange={handleChange}
                className="w-full px-4 py-3 text-[12px] font-bold font-mono bg-white border border-[#111] text-[#111] focus:outline-none focus:bg-[#fafafa] uppercase tracking-wider transition-colors rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Roles Operativos (Encabezado Pastel) */}
        <div className="bg-white border border-[#111]">
          <div className="border-b border-[#111] px-6 py-4 bg-indigo-50">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-indigo-900">
              Roles Operativos
            </h2>
          </div>
          <div className="p-6">
            <RoleSelector roles={formData} onToggleRole={handleToggleRole} />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaveDisabled}
            className={`flex items-center gap-2 px-8 py-4 transition-colors font-bold uppercase tracking-widest text-[11px] ${
              isSaveDisabled
                ? "bg-gray-200 text-gray-500 border border-[#ccc] cursor-not-allowed"
                : "bg-[#111] text-white hover:bg-[#333]"
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Guardando
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} /> Guardar Ajustes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
