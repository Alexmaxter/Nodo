import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Receipt, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext"; // <- RUTA CORREGIDA

export default function NewOperation() {
  const { id } = useParams(); // ID de la empresa contraparte
  const navigate = useNavigate();
  const { company: myCompany, loading: authLoading } = useAuth();

  const [targetCompany, setTargetCompany] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: "INVOICE", // INVOICE = Factura (Suma deuda) | RECEIPT = Pago (Resta deuda)
    amount: "",
    reference_number: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && id && myCompany?.id) {
      fetchContextData();
    }
  }, [id, authLoading, myCompany]);

  async function fetchContextData() {
    try {
      setLoading(true);

      // 1. Traer datos de la empresa objetivo
      const { data: compData, error: compError } = await supabase
        .from("companies")
        .select("id, legal_name, tax_id")
        .eq("id", id)
        .single();

      if (compError) throw compError;
      setTargetCompany(compData);

      // 2. Traer el vínculo para saber exactamente qué rol ocupamos en esta relación
      const { data: relData, error: relError } = await supabase
        .from("relationships")
        .select("provider_id, merchant_id")
        .or(
          `and(merchant_id.eq.${myCompany.id},provider_id.eq.${id}),and(merchant_id.eq.${id},provider_id.eq.${myCompany.id})`,
        )
        .single();

      if (relError) throw relError;
      setRelationship(relData);
    } catch (err) {
      console.error("Error al cargar contexto de la operación:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!relationship)
        throw new Error("No se encontró un vínculo comercial válido.");

      const { error } = await supabase.from("transactions").insert([
        {
          provider_id: relationship.provider_id,
          merchant_id: relationship.merchant_id,
          issuer_id: myCompany.id, // Siempre queda registrado que lo creaste tú
          type: formData.type,
          amount: Math.abs(parseFloat(formData.amount)), // Nos aseguramos que siempre sea positivo
          status: "APPROVED", // En esta Fase 1, se aprueba directo para afectar el saldo
          reference_number: formData.reference_number.trim(),
          description: formData.description.trim(),
        },
      ]);

      if (error) throw error;

      // Si salió todo bien, volvemos a la vista del detalle
      navigate(-1);
    } catch (err) {
      alert("Error al guardar operación: " + err.message);
      setSaving(false);
    }
  };

  const isCharge = formData.type === "INVOICE";

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-black font-bold uppercase tracking-[0.2em] text-xs">
          [ PREPARANDO FORMULARIO... ]
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ENCABEZADO */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black mb-8 transition-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> Cancelar y
          volver
        </button>
        <h1 className="text-2xl font-black uppercase tracking-widest text-black mb-2">
          Nueva Operación
        </h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
          DESTINATARIO: {targetCompany?.legal_name} ({targetCompany?.tax_id})
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 border border-zinc-300 bg-white p-8"
      >
        {/* SELECTOR DE TIPO DE OPERACIÓN */}
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`cursor-pointer border p-6 flex flex-col items-center gap-4 transition-none ${isCharge ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
          >
            <input
              type="radio"
              name="type"
              value="INVOICE"
              className="sr-only"
              checked={isCharge}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <Receipt className="w-8 h-8" strokeWidth={1.5} />
            <div className="text-center">
              <span className="block text-xs font-bold uppercase tracking-widest mb-1">
                Cargar Factura
              </span>
              <span className="block text-[9px] uppercase tracking-widest opacity-70">
                Aumenta la deuda en la cuenta
              </span>
            </div>
          </label>

          <label
            className={`cursor-pointer border p-6 flex flex-col items-center gap-4 transition-none ${!isCharge ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
          >
            <input
              type="radio"
              name="type"
              value="RECEIPT"
              className="sr-only"
              checked={!isCharge}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <DollarSign className="w-8 h-8" strokeWidth={1.5} />
            <div className="text-center">
              <span className="block text-xs font-bold uppercase tracking-widest mb-1">
                Registrar Pago
              </span>
              <span className="block text-[9px] uppercase tracking-widest opacity-70">
                Descuenta saldo deudor
              </span>
            </div>
          </label>
        </div>

        {/* CAMPOS DE DATOS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Monto (Obligatorio)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                className="w-full bg-zinc-50 border border-zinc-300 pl-10 pr-4 py-4 text-xl font-bold font-mono text-black focus:border-black focus:outline-none transition-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Número de Comprobante / Ref.
              </label>
              <input
                type="text"
                required
                value={formData.reference_number}
                onChange={(e) =>
                  setFormData({ ...formData, reference_number: e.target.value })
                }
                placeholder="EJ: FC-0001-4920"
                className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs font-bold text-black focus:border-black focus:outline-none uppercase tracking-widest transition-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Concepto Breve
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="EJ: MERCADERÍA ENERO"
                className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs font-bold text-black focus:border-black focus:outline-none uppercase tracking-widest transition-none"
              />
            </div>
          </div>
        </div>

        {/* BOTÓN DE GUARDADO */}
        <div className="pt-6 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 disabled:bg-zinc-400 transition-none"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            )}
            {saving ? "PROCESANDO..." : "CONFIRMAR OPERACIÓN"}
          </button>
        </div>
      </form>
    </div>
  );
}
