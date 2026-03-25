import { useState, useEffect } from "react";
import { X, Save, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function ProductModal({ productToEdit, onClose, onSaved }) {
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
  });

  // Pre-llenar datos
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        sku: productToEdit.sku || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        stock: productToEdit.stock || "",
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        company_id: company.id,
        name: formData.name.trim(),
        sku: formData.sku.trim() || null,
        description: formData.description.trim() || null,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
      };

      if (productToEdit) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productToEdit.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert([payload]);
        if (insertError) throw insertError;
      }
      onSaved();
    } catch (err) {
      setError("No se pudo guardar el producto. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Bloqueador de propagación para no cerrar si se hace clic DENTRO del modal
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} // Cierra si haces clic afuera
    >
      <div
        className="nodo-card w-full max-w-lg bg-white shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={handleModalClick} // Evita que se cierre al hacer clic adentro
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--nodo-border-mid)] bg-[#fcfcfc]">
          <h2 className="text-[14px] font-black uppercase tracking-widest text-[#111]">
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#111] transition-colors p-1"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Cuerpo / Formulario */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-800 flex items-start gap-2 rounded-sm">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}

          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#666]">
                Nombre del Producto *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Cemento 50kg"
                className="w-full px-3 py-2.5 text-[12px] font-bold bg-white border border-[#ccc] text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] uppercase tracking-wider transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#666]">
                Código SKU (Opcional)
              </label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ej: CEM-50K"
                className="w-full px-3 py-2.5 text-[12px] font-bold font-mono bg-white border border-[#ccc] text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] uppercase tracking-wider transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#666]">
                  Precio Unitario *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] font-mono">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 text-[12px] font-bold font-mono bg-white border border-[#ccc] text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#666]">
                  Stock *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 text-[12px] font-bold font-mono bg-white border border-[#ccc] text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#666]">
                Descripción (Opcional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Detalles adicionales..."
                className="w-full px-3 py-2 text-[12px] font-medium bg-white border border-[#ccc] text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111] transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* Pie del Modal */}
        <div className="p-6 border-t border-[var(--nodo-border-mid)] bg-[#fafafa] flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="nodo-btn-outline px-6 py-2.5 text-[10px]"
          >
            Cancelar
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={loading}
            className="nodo-btn nodo-btn-primary px-6 py-2.5 text-[10px] bg-[#111] text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Guardando
              </>
            ) : (
              <>
                <Save size={14} /> Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
