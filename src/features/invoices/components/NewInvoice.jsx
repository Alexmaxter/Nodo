import { ArrowLeft, Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewInvoice() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/panel")}
        className="flex items-center gap-2 text-zinc-500 font-bold hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        Volver a facturas
      </button>

      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
        Cargar Nueva Factura
      </h2>

      <form className="bg-nodo-card border-2 border-zinc-200 p-8 space-y-8">
        {/* Selector de Cliente */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-900">
            ¿A quién le facturas?
          </label>
          <select className="w-full p-4 bg-transparent border-2 border-zinc-300 text-zinc-900 focus:outline-none focus:border-nodo-primary transition-colors cursor-pointer font-medium appearance-none">
            <option value="">Selecciona un cliente de tu red...</option>
            <option value="1">Ferretería El Tornillo</option>
            <option value="2">Kiosco El Paso</option>
          </select>
        </div>

        {/* Datos de la Factura */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-900">
              Número de Documento
            </label>
            <input
              type="text"
              placeholder="Ej: FC-0001-4567"
              className="w-full p-4 bg-transparent border-2 border-zinc-300 focus:outline-none focus:border-nodo-primary transition-colors font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-bold text-zinc-900">
              Monto Total ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-4 bg-transparent border-2 border-zinc-300 focus:outline-none focus:border-nodo-primary transition-colors font-bold text-lg"
            />
          </div>
        </div>

        {/* Subir Archivo (Simulado) */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-900">
            Archivo Adjunto (PDF o Imagen)
          </label>
          <div className="border-2 border-dashed border-zinc-300 p-10 flex flex-col items-center justify-center text-zinc-500 hover:border-nodo-primary hover:text-nodo-primary transition-colors cursor-pointer bg-zinc-50">
            <Upload className="w-10 h-10 mb-3" strokeWidth={1.5} />
            <p className="font-bold">Haz clic para subir el remito o factura</p>
            <p className="text-sm mt-1">Soporta PDF, JPG, PNG hasta 5MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-bold text-zinc-900">
            Notas (Opcional)
          </label>
          <textarea
            rows="3"
            placeholder="Ej: Incluye mercadería del pedido #442..."
            className="w-full p-4 bg-transparent border-2 border-zinc-300 focus:outline-none focus:border-nodo-primary transition-colors resize-none"
          ></textarea>
        </div>

        {/* Botón de Submit */}
        <div className="pt-4 border-t-2 border-zinc-200 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 bg-nodo-primary text-white px-8 py-4 font-bold hover:bg-zinc-800 transition-colors"
          >
            <FileText className="w-5 h-5" strokeWidth={2} />
            Emitir y Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
