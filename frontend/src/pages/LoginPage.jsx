import { useState } from "react";
import { authAPI } from "../services/api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(username, password);
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative border pattern */}
      <div style={styles.borderTop} />

      <div style={styles.container}>
        {/* Header emblem */}
        <div style={styles.emblemArea}>
          <div style={styles.emblemCircle}>
            <span style={styles.emblemText}>🏛</span>
          </div>
          <h1 style={styles.villageName}>ग्रामपंचायत औरवाड</h1>
          <p style={styles.subtitle}>तालुका शिरोळ, जिल्हा कोल्हापूर</p>
          <div style={styles.divider} />
          <p style={styles.registerTitle}>
            नमुना नंबर १ — मागणी रजिस्टर सन २०२५-२६
          </p>
        </div>

        {/* Login card */}
        <div style={styles.card}>
          <h2 style={styles.loginTitle}>प्रवेश करा</h2>
          <p style={styles.loginSubtitle}>Sign in to access records</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={styles.hint}>
            Default: <span style={styles.hintCode}>admin</span> /{" "}
            <span style={styles.hintCode}>admin123</span>
          </div>
        </div>
      </div>

      <div style={styles.borderBottom} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #FBF5E8 0%, #EDE4CC 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "2rem",
  },
  borderTop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background:
      "linear-gradient(90deg, #E8681A, #C04F0F, #5C6B2E, #C04F0F, #E8681A)",
  },
  borderBottom: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "6px",
    background:
      "linear-gradient(90deg, #5C6B2E, #E8681A, #C04F0F, #E8681A, #5C6B2E)",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  },
  emblemArea: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem",
  },
  emblemCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #E8681A, #C04F0F)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(232,104,26,0.35)",
    marginBottom: "0.5rem",
  },
  emblemText: { fontSize: "2rem" },
  villageName: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "1.7rem",
    fontWeight: "700",
    color: "#1A1209",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "0.9rem",
    color: "#5C6B2E",
    fontWeight: "500",
  },
  divider: {
    width: "60px",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #E8681A, transparent)",
    margin: "0.3rem 0",
  },
  registerTitle: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.85rem",
    color: "#7A6040",
    letterSpacing: "0.02em",
  },
  card: {
    width: "100%",
    background: "#FFFDF5",
    border: "1px solid #C8B896",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(26,18,9,0.1), 0 2px 8px rgba(26,18,9,0.06)",
  },
  loginTitle: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "1.4rem",
    color: "#1A1209",
    marginBottom: "0.2rem",
  },
  loginSubtitle: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.9rem",
    color: "#7A6040",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  label: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#5C4A28",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  input: {
    padding: "0.65rem 0.9rem",
    border: "1.5px solid #C8B896",
    borderRadius: "7px",
    background: "#FFFDF5",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.9rem",
    color: "#1A1209",
    outline: "none",
    transition: "border-color 0.2s",
  },
  errorBox: {
    background: "#FEF0EE",
    border: "1px solid #E8A090",
    borderRadius: "7px",
    padding: "0.65rem 0.9rem",
    fontSize: "0.85rem",
    color: "#B82A2A",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorIcon: { fontSize: "1rem" },
  button: {
    padding: "0.75rem",
    background: "linear-gradient(135deg, #E8681A, #C04F0F)",
    color: "#FFFDF5",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "1rem",
    fontWeight: "700",
    letterSpacing: "0.02em",
    marginTop: "0.3rem",
    transition: "transform 0.1s, box-shadow 0.1s",
    boxShadow: "0 3px 12px rgba(232,104,26,0.35)",
  },
  hint: {
    marginTop: "1rem",
    fontSize: "0.78rem",
    color: "#9A8060",
    textAlign: "center",
    fontFamily: "'Crimson Pro', serif",
  },
  hintCode: {
    fontFamily: "'DM Mono', monospace",
    background: "#EDE4CC",
    padding: "1px 5px",
    borderRadius: "3px",
    fontSize: "0.78rem",
    color: "#5C4A28",
  },
};
