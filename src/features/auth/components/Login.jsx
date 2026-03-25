import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { Mail, Lock, Loader2, AlertCircle, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("El correo o la contraseña son incorrectos.");
        }
        throw signInError;
      }

      navigate("/panel");
    } catch (err) {
      console.error("[Login] Error:", err.message);
      setError(err.message || "Hubo un error al intentar iniciar sesión.");
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
              Terminal operativa
            </span>
          </div>
        </div>

        {/* ── ERROR (fuera del recuadro) ── */}
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

        {/* ── RECUADRO: solo inputs y botón ── */}
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
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
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
                <button
                  type="button"
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--nodo-merchant-action)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ¿Olvidaste?
                </button>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
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
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn size={13} strokeWidth={2} />
                  Acceder al panel
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
            ¿Sin cuenta?{" "}
            <Link
              to="/registro"
              style={{
                color: "#111",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textDecoration: "none",
              }}
            >
              Regístrate →
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
