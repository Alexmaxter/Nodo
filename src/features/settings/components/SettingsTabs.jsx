import { Briefcase, Users, ShieldCheck } from "lucide-react";

export default function SettingsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col md:flex-row border-b border-[#111] mb-8">
      <button
        onClick={() => setActiveTab("general")}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors md:border-r border-b md:border-b-0 border-[#111] ${
          activeTab === "general"
            ? "bg-[#111] text-white"
            : "bg-[#fcfcfc] text-[#666] hover:bg-white hover:text-[#111]"
        }`}
      >
        <Briefcase size={14} /> General
      </button>

      <button
        onClick={() => setActiveTab("miembros")}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors md:border-r border-b md:border-b-0 border-[#111] ${
          activeTab === "miembros"
            ? "bg-[#111] text-white"
            : "bg-[#fcfcfc] text-[#666] hover:bg-white hover:text-[#111]"
        }`}
      >
        <Users size={14} /> Equipo
      </button>

      <button
        onClick={() => setActiveTab("roles")}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors ${
          activeTab === "roles"
            ? "bg-[#111] text-white"
            : "bg-[#fcfcfc] text-[#666] hover:bg-white hover:text-[#111]"
        }`}
      >
        <ShieldCheck size={14} /> Roles y Permisos
      </button>
    </div>
  );
}
