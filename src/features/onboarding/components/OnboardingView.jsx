import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

import CompanyEntrySelector from "./CompanyEntrySelector";
import CreateCompanyStep from "./CreateCompanyStep";
import JoinCompanyStep from "./JoinCompanyStep";
import PendingApprovalStep from "./PendingApprovalStep";

const LS_KEY = "nodo_onboarding_step";

export default function OnboardingView() {
  const navigate = useNavigate();
  const { user, company, refreshCompany } = useAuth();

  const [step, setStep] = useState(
    () => localStorage.getItem(LS_KEY) || "selection",
  );
  const [pendingCompany, setPendingCompany] = useState(null);
  const [checkingInitial, setCheckingInitial] = useState(true);

  useEffect(() => {
    if (company) {
      localStorage.removeItem(LS_KEY);
      navigate("/panel", { replace: true });
      return;
    }

    const checkPendingRequests = async () => {
      if (!user) {
        setCheckingInitial(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("company_members")
          .select("status, company:companies(id, legal_name, tax_id)")
          .eq("profile_id", user.id)
          .eq("status", "pending")
          .maybeSingle();

        if (data) {
          setPendingCompany(data.company);
          setStep("pending");
          localStorage.removeItem(LS_KEY);
        }
      } catch (err) {
        console.error("Error verificando pendientes:", err);
      } finally {
        setCheckingInitial(false);
      }
    };

    checkPendingRequests();
  }, [user, company, navigate]);

  const changeStep = (newStep) => {
    setStep(newStep);
    if (newStep === "selection" || newStep === "pending") {
      localStorage.removeItem(LS_KEY);
    } else {
      localStorage.setItem(LS_KEY, newStep);
    }
  };

  if (checkingInitial) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#111]" size={20} />
      </div>
    );
  }

  if (step === "pending") {
    return <PendingApprovalStep pendingCompany={pendingCompany} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Topbar */}
      <div className="h-14 border-b-2 border-[#111] flex items-stretch bg-white shrink-0">
        {/* Logo */}
        <div className="px-6 flex items-center border-r-2 border-[#111] gap-3">
          <div className="w-6 h-6 border-2 border-[#111] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#111] rounded-full" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111]">
            Nodo
          </span>
        </div>

        {/* Volver (si aplica) */}
        {step !== "selection" && (
          <button
            onClick={() => changeStep("selection")}
            className="flex items-center gap-2 px-6 text-[10px] font-black uppercase tracking-widest text-[#666] border-r-2 border-[#111] cursor-pointer"
          >
            <ChevronLeft size={14} strokeWidth={2.5} /> Volver
          </button>
        )}

        {/* Breadcrumb de paso */}
        <div className="flex items-center px-6 ml-auto border-l-2 border-[#111]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999]">
            {step === "selection" && "Inicio"}
            {step === "create" && "Registrar Empresa"}
            {step === "join" && "Unirse a Equipo"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center p-10">
        {step === "selection" && <CompanyEntrySelector onSelect={changeStep} />}
        {step === "create" && (
          <CreateCompanyStep
            onFinish={async () => {
              await refreshCompany();
            }}
          />
        )}
        {step === "join" && (
          <JoinCompanyStep
            user={user}
            onRequested={(comp) => {
              setPendingCompany(comp);
              changeStep("pending");
            }}
          />
        )}
      </div>
    </div>
  );
}
