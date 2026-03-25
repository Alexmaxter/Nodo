import { useState } from "react";
import { Building2, Save, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import RoleSelector from "./RoleSelector";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateCompanyStep({ onFinish }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    legal_name: "",
    tax_id: "",
    is_merchant: false,
    is_provider: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.is_merchant && !formData.is_provider) {
      setError("Debes seleccionar al menos un rol operativo.");
      return;
    }

    if (!user || !user.id) {
      setError("No pudimos verificar tu sesión. Intenta recargar la página.");
      return;
    }

    setLoading(true);

    try {
      const { data: companyData, error: insertError } = await supabase
        .from("companies")
        .insert([
          {
            owner_id: user.id,
            legal_name: formData.legal_name.trim(),
            tax_id: formData.tax_id.trim(),
            is_merchant: formData.is_merchant,
            is_provider: formData.is_provider,
          },
        ])
        .select();

      if (insertError) throw insertError;

      const newCompany = companyData[0];

      const { error: memberError } = await supabase
        .from("company_members")
        .insert([
          {
            company_id: newCompany.id,
            profile_id: user.id,
            role: "admin",
            status: "approved",
          },
        ]);

      if (memberError) throw memberError;

      if (onFinish) await onFinish();

      navigate("/panel", { replace: true });
    } catch (err) {
      console.error("[CreateCompany] Excepción capturada:", err);

      if (err.code === "23503" && err.message?.includes("profiles")) {
        setError(
          "Error Crítico: Tu usuario no tiene un perfil creado en la base de datos.",
        );
      } else if (err.code === "23505") {
        setError(
          "Este CUIT o Identificación Fiscal ya se encuentra registrado en el sistema.",
        );
      } else {
        setError(
          err.message ||
            "Hubo un error al registrar la empresa. Intenta nuevamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Encabezado */}
      <div className="mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999] block mb-4">
          Nueva Entidad
        </span>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-[#111] leading-none">
          Registrar
          <br />
          Empresa
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 border-2 border-[#111] flex items-stretch">
          <div className="w-14 shrink-0 bg-red-600 flex items-center justify-center border-r-2 border-[#111]">
            <AlertCircle size={20} className="text-white" strokeWidth={2} />
          </div>
          <p className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-900 bg-red-50">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* ── Datos Fiscales ──────────────────────────── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-stretch border-2 border-[#111]">
            {/* Ícono lateral */}
            <div className="w-14 shrink-0 bg-blue-600 border-r-2 border-[#111] flex items-center justify-center">
              <Building2 size={20} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 px-6 py-3 bg-blue-50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900">
                Datos Fiscales
              </span>
            </div>
          </div>

          <div className="border-2 border-t-0 border-[#111] bg-white flex flex-col divide-y-2 divide-[#111]">
            {/* Razón Social */}
            <div className="flex flex-col gap-2 p-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#666]">
                Razón Social / Nombre Comercial
              </label>
              <input
                required
                type="text"
                placeholder="Ej: Mi Empresa S.A."
                value={formData.legal_name}
                onChange={(e) =>
                  setFormData({ ...formData, legal_name: e.target.value })
                }
                className="w-full px-4 py-3 text-[13px] font-bold bg-[#fafafa] border border-[#ddd] text-[#111] focus:outline-none focus:border-[#111] uppercase tracking-wider"
              />
            </div>

            {/* CUIT */}
            <div className="flex flex-col gap-2 p-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#666]">
                Identificación Fiscal (CUIT / RUT)
              </label>
              <input
                required
                type="text"
                placeholder="Ej: 30-12345678-9"
                value={formData.tax_id}
                onChange={(e) =>
                  setFormData({ ...formData, tax_id: e.target.value })
                }
                className="w-full px-4 py-3 text-[13px] font-bold font-mono bg-[#fafafa] border border-[#ddd] text-[#111] focus:outline-none focus:border-[#111] tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* ── Roles ───────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#666]">
              Roles Operativos
            </span>
            <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">
              Podés elegir ambos
            </span>
          </div>
          <RoleSelector
            roles={formData}
            onToggleRole={(roleType) => {
              const key =
                roleType === "comerciante" ? "is_merchant" : "is_provider";
              setFormData({ ...formData, [key]: !formData[key] });
            }}
          />
        </div>

        {/* ── Submit ──────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-[#111] bg-[#111] text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 py-5 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Registrando...
            </>
          ) : (
            <>
              <Save size={15} strokeWidth={2.5} /> Finalizar Registro
            </>
          )}
        </button>
      </form>
    </div>
  );
}
