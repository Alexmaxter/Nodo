import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Loader2 } from "lucide-react";

// Subcomponentes
import SettingsTabs from "./SettingsTabs";
import GeneralSettings from "./GeneralSetings";
import CompanyMembers from "./CompanyMembers";
import RoleManagement from "./RoleManagement";

export default function Settings() {
  const { company, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  if (authLoading) {
    return (
      <div className="w-full flex justify-center p-20 border border-[#111] bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#111]" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="w-full flex flex-col pb-20 animate-in fade-in duration-300">
      {/* Pestañas de Navegación */}
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Renderizado Condicional del Contenido */}
      <div className="w-full">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "miembros" && <CompanyMembers companyId={company?.id} />}
        {activeTab === "roles" && <RoleManagement />}
      </div>
    </div>
  );
}
