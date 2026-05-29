import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RecordsPage from "./pages/RecordsPage";
import OrdersPage from "./pages/OrdersPage";
import SMSPage from "./pages/SMSPage";
import { authAPI } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activePage, setActivePage] = useState("records"); // 'records' | 'orders' | 'sms'

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (token && savedUser) {
      authAPI
        .me()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  function handleLogout() {
    authAPI.logout().catch(() => {});
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF5E8",
          gap: "1rem",
          fontFamily: "'Crimson Pro', serif",
          color: "#7A6040",
          fontSize: "1.1rem",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            border: "3px solid #C8B896",
            borderTop: "3px solid #E8681A",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        लोड होत आहे…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input:focus { border-color: #E8681A !important; box-shadow: 0 0 0 3px rgba(232,104,26,0.15); }
        `}</style>
        <LoginPage onLogin={(u) => setUser(u)} />
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #E8681A !important; box-shadow: 0 0 0 3px rgba(232,104,26,0.15); }
        tr:hover td { background: rgba(232,104,26,0.04) !important; }
      `}</style>

      {/* Page switcher tabs */}
      <div
        style={{
          background: "#3A2A1A",
          display: "flex",
          gap: "0",
          fontFamily: "'Crimson Pro', serif",
        }}
      >
        {[
          { key: "records", label: "कर नोंदी" },
          { key: "orders", label: "ऑर्डर्स" },
          { key: "sms", label: "SMS नोंदणी" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePage(tab.key)}
            style={{
              padding: "0.55rem 1.5rem",
              border: "none",
              background:
                activePage === tab.key
                  ? "linear-gradient(135deg, #E8681A, #C8501A)"
                  : "transparent",
              color: activePage === tab.key ? "#fff" : "#C8B896",
              cursor: "pointer",
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1rem",
              fontWeight: activePage === tab.key ? 700 : 400,
              borderBottom:
                activePage === tab.key
                  ? "3px solid #FFB060"
                  : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activePage === "records" ? (
        <RecordsPage user={user} onLogout={handleLogout} />
      ) : activePage === "orders" ? (
        <OrdersPage user={user} onLogout={handleLogout} />
      ) : (
        <SMSPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
