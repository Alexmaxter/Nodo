import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCompany(userId) {
    if (!userId) {
      setCompany(null);
      return null;
    }

    try {
      setError(null);

      // 1. ¿Es dueño de una empresa?
      const { data: ownedCompany, error: errOwned } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle();

      if (errOwned) throw errOwned;

      if (ownedCompany) {
        setCompany(ownedCompany);
        return ownedCompany;
      }

      // 2. ¿Es miembro aprobado?
      const { data: membership, error: errMember } = await supabase
        .from("company_members")
        .select("status, companies(*)")
        .eq("profile_id", userId)
        .eq("status", "approved")
        .maybeSingle();

      if (errMember) throw errMember;

      if (membership?.companies) {
        setCompany(membership.companies);
        return membership.companies;
      }

      setCompany(null);
      return null;
    } catch (err) {
      console.error("[AuthContext] Error fetchCompany:", err.message);
      setError("Error de conexión al cargar datos de la empresa.");
      setCompany(null);
      return null;
    }
  }

  const refreshCompany = async () => {
    if (user?.id) return await fetchCompany(user.id);
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    // 1. OBTENER SESIÓN EXPLÍCITA (Soluciona las desconexiones silenciosas)
    // Es necesario llamar a esto para que los temporizadores internos
    // de auto-renovación de token de Supabase se activen correctamente.
    supabase.auth.getSession().catch(console.error);

    // 2. ESCUCHAR EVENTOS DE AUTENTICACIÓN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] onAuthStateChange event:", event);
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === "SIGNED_OUT") {
        setCompany(null);
        setError(null);
        localStorage.removeItem("nodo_onboarding_step");
        setLoading(false);
        return;
      }

      if (currentUser) {
        // LA CORRECCIÓN CLAVE ESTÁ AQUÍ:
        // Solo vamos a buscar la empresa si es el inicio de la app o un inicio de sesión.
        // Si el evento es "TOKEN_REFRESHED", NO hacemos nada porque la empresa ya
        // está cargada. Hacerlo reiniciaría todos los componentes sin motivo.
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
          try {
            await fetchCompany(currentUser.id);
          } catch (err) {
            console.error(
              "[AuthContext] Error al actualizar estado:",
              err.message,
            );
          }
        }
      } else {
        setCompany(null);
      }

      // Liberamos la carga al final
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, company, loading, error, refreshCompany }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
