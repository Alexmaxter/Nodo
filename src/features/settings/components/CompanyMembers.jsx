import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Users,
  UserPlus,
  Loader2,
  Trash2,
  Check,
  X,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function CompanyMembers({ companyId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      if (!companyId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const { data, error } = await supabase
          .from("company_members")
          .select("id, role, status, profiles(id, full_name)")
          .eq("company_id", companyId);

        if (error) throw error;

        if (isMounted) setMembers(data || []);
      } catch (err) {
        if (isMounted) console.error("Error cargando miembros:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleUpdateStatus = async (memberId, newStatus) => {
    setProcessingId(memberId);
    try {
      const { error } = await supabase
        .from("company_members")
        .update({ status: newStatus })
        .eq("id", memberId);
      if (error) throw error;
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m)),
      );
    } catch (err) {
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar a este miembro?"))
      return;
    setProcessingId(memberId);
    try {
      const { error } = await supabase
        .from("company_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      alert("Hubo un error al eliminar el miembro.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center border border-[#111] bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#111] mb-2" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
          Cargando equipo...
        </span>
      </div>
    );
  }

  const pendingMembers = members.filter((m) => m.status === "pending");
  const activeMembers = members.filter((m) => m.status === "approved");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white border border-[#111] p-5">
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-tight text-[#111]">
            Gestión de Accesos
          </h2>
          <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.1em] mt-1">
            Administra quién puede operar en nombre de tu empresa.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#111] text-white hover:bg-[#333] transition-colors border border-[#111]">
          <UserPlus size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
            Invitar
          </span>
        </button>
      </div>

      {/* ── SOLICITUDES PENDIENTES ── */}
      {pendingMembers.length > 0 && (
        <div className="flex flex-col border border-[#111] bg-white">
          <div className="flex items-center gap-3 bg-amber-50 border-b border-[#111] p-4">
            <Clock size={16} className="text-amber-900" />
            <h2 className="text-[12px] font-black uppercase tracking-tight text-amber-900">
              Solicitudes Pendientes ({pendingMembers.length})
            </h2>
          </div>
          <div className="flex flex-col">
            {pendingMembers.map((member, idx) => (
              <div
                key={member.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-[#fafafa] transition-colors ${
                  idx !== pendingMembers.length - 1
                    ? "border-b border-[#111]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white text-[#111] flex items-center justify-center font-black text-[12px] uppercase tracking-widest shrink-0 border border-[#111]">
                    {(member.profiles?.full_name || "??").substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-widest text-[#111]">
                      {member.profiles?.full_name || "Usuario Desconocido"}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#666] mt-1">
                      Desea unirse
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0 border border-[#111]">
                  <button
                    onClick={() => handleUpdateStatus(member.id, "approved")}
                    disabled={processingId === member.id}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors border-r border-[#111]"
                  >
                    {processingId === member.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} strokeWidth={3} />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Aceptar
                    </span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(member.id, "rejected")}
                    disabled={processingId === member.id}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#111] hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {processingId === member.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <X size={14} strokeWidth={3} />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Rechazar
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MIEMBROS ACTIVOS ── */}
      <div className="flex flex-col border border-[#111] bg-white">
        <div className="flex items-center gap-3 bg-blue-50 border-b border-[#111] p-4">
          <Users size={16} className="text-blue-900" />
          <h2 className="text-[12px] font-black uppercase tracking-tight text-blue-900">
            Miembros Activos ({activeMembers.length})
          </h2>
        </div>

        {activeMembers.length === 0 ? (
          <div className="p-8 text-center text-[#666] text-[11px] font-bold uppercase tracking-widest">
            Aún no hay miembros.
          </div>
        ) : (
          <div className="flex flex-col">
            {activeMembers.map((member, idx) => (
              <div
                key={member.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-[#fafafa] transition-colors ${
                  idx !== activeMembers.length - 1
                    ? "border-b border-[#111]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#111] text-white border border-[#111] flex items-center justify-center font-black text-[12px] uppercase tracking-widest shrink-0">
                    {(member.profiles?.full_name || "??").substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-widest text-[#111] mb-1.5">
                      {member.profiles?.full_name || "Usuario Desconocido"}
                    </p>

                    {/* 👇 PÍLDORA CUADRADA CON DROPDOWN DE ROL 👇 */}
                    <div className="relative inline-block w-32">
                      <select
                        defaultValue={member.role}
                        className="appearance-none w-full bg-white border border-[#111] pl-3 pr-8 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#111] focus:outline-none focus:bg-[#fafafa] cursor-pointer rounded-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Miembro</option>
                      </select>
                      <ChevronDown
                        size={12}
                        strokeWidth={3}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#111] pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 border border-[#111] text-[9px] font-bold uppercase tracking-widest bg-[#f4f4f4] text-[#111]">
                    Activo
                  </span>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={processingId === member.id}
                    title="Eliminar miembro"
                    className="p-3 text-[#111] hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-[#111] disabled:opacity-50"
                  >
                    {processingId === member.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
