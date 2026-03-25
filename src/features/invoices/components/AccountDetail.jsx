import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

// Asumimos que recibes el ID de la cuenta a visualizar por props (o por URL params)
export default function AccountDetail({ accountId }) {
  const { company } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company?.id || !accountId) return;

    const fetchAccountData = async () => {
      try {
        // Buscamos transacciones entre las dos empresas
        const { data, error } = await supabase
          .from("transactions") // O 'invoices' según tu tabla
          .select("*")
          .or(
            `and(issuer_id.eq.${company.id},receiver_id.eq.${accountId}),and(issuer_id.eq.${accountId},receiver_id.eq.${company.id})`,
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        setTransactions(data);

        // Calculamos el saldo (Lógica de ejemplo: facturas emitidas suman, recibidas restan)
        const currentBalance = data.reduce((acc, curr) => {
          if (curr.issuer_id === company.id) return acc + curr.amount;
          return acc - curr.amount;
        }, 0);

        setBalance(currentBalance);
      } catch (err) {
        console.error("Error al cargar la cuenta:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [company, accountId]);

  if (loading)
    return (
      <div className="p-8 font-black uppercase text-zinc-400">
        Calculando saldos...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Cabecera de Saldo */}
      <div
        className={`border-4 border-zinc-900 p-6 flex justify-between items-center ${balance >= 0 ? "bg-zinc-100" : "bg-red-50 text-red-900"}`}
      >
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
            Saldo Consolidado
          </h2>
          <p className="text-4xl font-black font-mono tracking-tighter mt-1">
            ${Math.abs(balance).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <span className="font-black uppercase tracking-widest text-xl">
            {balance >= 0 ? "A FAVOR" : "EN CONTRA"}
          </span>
        </div>
      </div>

      {/* Historial (Log de Actividad) */}
      <div className="border-4 border-zinc-900 bg-white">
        <div className="bg-zinc-900 text-white p-3 font-black uppercase tracking-widest text-sm">
          Log de Transacciones
        </div>
        <div className="divide-y-4 divide-zinc-200">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 flex justify-between items-center hover:bg-zinc-50"
            >
              <div>
                <p className="font-black uppercase">{tx.type || "Factura"}</p>
                <p className="font-bold text-zinc-400 font-mono text-xs mt-1">
                  {new Date(tx.created_at).toLocaleDateString()}
                </p>
              </div>
              <div
                className={`font-black font-mono text-lg ${tx.issuer_id === company.id ? "text-zinc-900" : "text-red-600"}`}
              >
                {tx.issuer_id === company.id ? "+" : "-"}$
                {tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-8 text-center text-zinc-400 font-bold uppercase tracking-wider">
              Sin movimientos registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
