import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../hooks/useAuth";
import { FileText, Plus, Search } from "lucide-react";

export default function InvoiceList() {
  const { company } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchTransactions() {
      if (isMounted) setLoading(true);

      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
            *,
            relationships (
              provider:companies!relationships_provider_id_fkey (legal_name)
            )
          `,
          )
          .order("issued_at", { ascending: false });

        if (error) throw error;

        if (isMounted) setTransactions(data || []);
      } catch (error) {
        if (isMounted)
          console.error("Error cargando transacciones:", error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (company?.id) {
      fetchTransactions();
    } else {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [company]);

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Transacciones
          </h2>
          <p className="text-zinc-500 text-sm font-medium italic">
            Historial de facturas y pagos
          </p>
        </div>
        <button className="bg-zinc-900 text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 transition-all">
          Cargar Movimiento
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center animate-pulse font-bold text-zinc-300 uppercase tracking-widest">
          Cargando...
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 py-24 text-center">
          <FileText className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            No hay movimientos registrados
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b-2 border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="p-4">Fecha</th>
                <th className="p-4">Entidad</th>
                <th className="p-4">Nro Documento</th>
                <th className="p-4">Tipo</th>
                <th className="p-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-zinc-50 transition-colors text-sm font-medium"
                >
                  <td className="p-4 text-zinc-500 font-mono">
                    {new Date(tx.issued_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-zinc-900">
                    {tx.relationships?.provider?.legal_name}
                  </td>
                  <td className="p-4 text-zinc-400">{tx.document_number}</td>
                  <td className="p-4 italic text-xs capitalize">{tx.type}</td>
                  <td
                    className={`p-4 text-right font-black ${tx.type === "payment" ? "text-emerald-600" : "text-zinc-900"}`}
                  >
                    {tx.type === "payment" ? "-" : ""}$
                    {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
