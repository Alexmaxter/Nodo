import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } },
      });

      if (signUpError) throw signUpError;

      navigate("/onboarding");
    } catch (err) {
      console.error("[Register] Error:", err.message);
      setError(
        "Hubo un error al registrarse. Verifica tus datos o intenta con otro correo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: "var(--nodo-bg-page)" }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── LOGO + MARCA ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px",
          }}
        >
          <div
            className="nodo-sidebar-logo"
            style={{ width: "36px", height: "36px" }}
          >
            <div className="nodo-sidebar-logo-dot" />
          </div>
          <div style={{ textAlign: "center" }}>
            <span
              className="nodo-topbar-value"
              style={{
                fontSize: "14px",
                letterSpacing: "0.22em",
                display: "block",
              }}
            >
              NODO
            </span>
            <span
              className="nodo-topbar-label"
              style={{ marginBottom: 0, display: "block", marginTop: "5px" }}
            >
              Únete a la red operativa
            </span>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "8px 12px",
              borderLeft: "2px solid var(--nodo-danger-head)",
              background: "var(--nodo-danger-body)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle
              size={12}
              style={{ color: "var(--nodo-danger-text)", flexShrink: 0 }}
            />
            <span
              className="nodo-card-head-label"
              style={{ color: "var(--nodo-danger-text)" }}
            >
              {error}
            </span>
          </div>
        )}

        {/* ── RECUADRO ── */}
        <div
          style={{
            width: "100%",
            border: "1px solid var(--nodo-border)",
            background: "var(--nodo-white)",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Nombre */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                className="nodo-topbar-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: 0,
                }}
              >
                <User size={11} strokeWidth={2.5} />
                Nombre completo
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Ej: Juan Pérez"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  padding: "11px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid var(--nodo-border-mid)",
                  borderRadius: 0,
                  background: "var(--nodo-bg-page)",
                  color: "#111",
                  outline: "none",
                  width: "100%",
                  fontFamily: "inherit",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border-mid)")
                }
              />
            </div>

            {/* Email */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                className="nodo-topbar-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: 0,
                }}
              >
                <Mail size={11} strokeWidth={2.5} />
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  padding: "11px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid var(--nodo-border-mid)",
                  borderRadius: 0,
                  background: "var(--nodo-bg-page)",
                  color: "#111",
                  outline: "none",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border-mid)")
                }
              />
            </div>

            {/* Password */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                className="nodo-topbar-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: 0,
                }}
              >
                <Lock size={11} strokeWidth={2.5} />
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                style={{
                  padding: "11px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid var(--nodo-border-mid)",
                  borderRadius: 0,
                  background: "var(--nodo-bg-page)",
                  color: "#111",
                  outline: "none",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--nodo-border-mid)")
                }
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="nodo-btn-primary"
              style={{
                marginTop: "4px",
                padding: "12px 16px",
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight size={13} strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span
            className="nodo-topbar-label"
            style={{ marginBottom: 0, color: "#bbb" }}
          >
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/"
              style={{
                color: "#111",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textDecoration: "none",
              }}
            >
              Iniciar sesión →
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
