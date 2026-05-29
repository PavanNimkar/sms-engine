// src/OrdersPage.jsx
// ऑर्डर्स पृष्ठ — धारकांची यादी + CRUD + ऑर्डर फॉर्म

import { useState, useEffect, useCallback } from "react";
import { holdersAPI } from "../services/api";
import HolderTable from "../components/HolderTable";
import HolderFormModal from "../components/HolderFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import OrderFormModal from "../components/OrderFormModal";
import OrderCard from "../components/OrderCard";

// ── Small toast helper ───────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "error" ? "#fee2e2" : "#dcfce7";
  const bdr = type === "error" ? "#fca5a5" : "#86efac";
  const clr = type === "error" ? "#dc2626" : "#166534";
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${bdr}`,
        color: clr,
        borderRadius: 8,
        padding: "0.65rem 1rem",
        marginBottom: "1rem",
        fontWeight: 600,
        fontFamily: "'Crimson Pro', serif",
        fontSize: "0.95rem",
      }}
    >
      {msg}
    </div>
  );
}

export default function OrdersPage({ user, onLogout }) {
  // ── Holders state ──────────────────────────────────────────
  const [holders, setHolders] = useState([]);
  const [hLoading, setHLoading] = useState(true);
  const [hSearch, setHSearch] = useState("");

  // ── Orders state ───────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [oLoading, setOLoading] = useState(true);
  const [oSearch, setOSearch] = useState("");

  // ── Modal state ────────────────────────────────────────────
  const [holderModal, setHolderModal] = useState(null); // null | { mode:'create'|'edit', holder?:obj }
  const [deleteTarget, setDeleteTarget] = useState(null); // holder obj to confirm-delete
  const [deleting, setDeleting] = useState(null); // id being deleted (spinner)
  const [showOrderForm, setShowOrderForm] = useState(false);

  // ── Toast ──────────────────────────────────────────────────
  const [toast, setToast] = useState({ msg: "", type: "success" });
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  }

  // ── Fetch helpers ──────────────────────────────────────────
  const fetchHolders = useCallback(async (q = "") => {
    setHLoading(true);
    try {
      const res = await holdersAPI.list(q ? { search: q } : {});
      setHolders(Array.isArray(res.data) ? res.data : (res.data.results ?? []));
    } catch {
      /* keep stale */
    } finally {
      setHLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(
    async (q = "") => {
      setOLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const url = q
          ? `/api/orders/?search=${encodeURIComponent(q)}`
          : "/api/orders/";
        const res = await fetch(url, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.status === 401) {
          onLogout();
          return;
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : (data.results ?? []));
      } catch {
        /* keep stale */
      } finally {
        setOLoading(false);
      }
    },
    [onLogout],
  );

  useEffect(() => {
    fetchHolders();
  }, [fetchHolders]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchHolders(hSearch), 350);
    return () => clearTimeout(t);
  }, [hSearch, fetchHolders]);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(oSearch), 350);
    return () => clearTimeout(t);
  }, [oSearch, fetchOrders]);

  // ── CRUD callbacks ─────────────────────────────────────────
  function handleHolderSaved(savedHolder, isEdit) {
    if (isEdit) {
      setHolders((prev) =>
        prev.map((h) => (h.id === savedHolder.id ? savedHolder : h)),
      );
      showToast("धारक यशस्वीरित्या अद्यतनित केला. ✓");
    } else {
      setHolders((prev) => [savedHolder, ...prev]);
      showToast("नवीन धारक यशस्वीरित्या जोडला. ✓");
    }
    setHolderModal(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await holdersAPI.destroy(deleteTarget.id);
      setHolders((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      showToast(`"${deleteTarget.holder_name}" हटवला.`);
      setDeleteTarget(null);
    } catch {
      showToast("हटवताना चूक झाली.", "error");
    } finally {
      setDeleting(null);
    }
  }

  function handleOrderSuccess(newOrder) {
    setOrders((prev) => [newOrder, ...prev]);
    setShowOrderForm(false);
    showToast("ऑर्डर यशस्वीरित्या जतन केली. ✓");
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF5E8",
        fontFamily: "'Crimson Pro', serif",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          background: "linear-gradient(135deg,#E8681A,#C8501A)",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>
          ग्राम पंचायत — ऑर्डर्स व धारक
        </span>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ color: "#FFE0C0", fontSize: "0.9rem" }}>
            {user?.username}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              padding: "0.3rem 0.8rem",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: "0.88rem",
            }}
          >
            बाहेर पडा
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <Toast {...toast} />

        {/* ═══════════════════════════════════════
            SECTION 1 — धारक (Holders)
        ════════════════════════════════════════ */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#3A2A1A",
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              मिळकत धारक
            </h2>
            <button
              onClick={() => setHolderModal({ mode: "create" })}
              style={primaryBtn}
            >
              + नवीन धारक
            </button>
          </div>

          {/* Search */}
          <input
            type="search"
            placeholder="नाव, अनु. नंबर किंवा फोन नंबरने शोधा…"
            value={hSearch}
            onChange={(e) => setHSearch(e.target.value)}
            style={searchStyle}
          />

          <div
            style={{
              fontSize: "0.85rem",
              color: "#8A7060",
              margin: "0.5rem 0 0.75rem",
            }}
          >
            {hLoading ? "" : `${holders.length} धारक`}
          </div>

          <HolderTable
            holders={holders}
            loading={hLoading}
            onEdit={(h) => setHolderModal({ mode: "edit", holder: h })}
            onDelete={(h) => setDeleteTarget(h)}
            deleting={deleting}
          />
        </section>

        {/* ═══════════════════════════════════════
            SECTION 2 — ऑर्डर्स
        ════════════════════════════════════════ */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#3A2A1A",
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              ऑर्डर्स
            </h2>
            <button onClick={() => setShowOrderForm(true)} style={primaryBtn}>
              + नवीन ऑर्डर
            </button>
          </div>

          <input
            type="search"
            placeholder="नाव किंवा फोन नंबरने शोधा…"
            value={oSearch}
            onChange={(e) => setOSearch(e.target.value)}
            style={searchStyle}
          />

          <div
            style={{
              fontSize: "0.85rem",
              color: "#8A7060",
              margin: "0.5rem 0 0.75rem",
            }}
          >
            {oLoading ? "" : `${orders.length} ऑर्डर्स`}
          </div>

          {oLoading ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <Empty
              text={
                oSearch
                  ? `"${oSearch}" साठी ऑर्डर नाही.`
                  : "अद्याप कोणतीही ऑर्डर नाही."
              }
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Modals ── */}
      {holderModal && (
        <HolderFormModal
          holder={holderModal.mode === "edit" ? holderModal.holder : null}
          onClose={() => setHolderModal(null)}
          onSaved={handleHolderSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          holder={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting === deleteTarget?.id}
        />
      )}

      {showOrderForm && (
        <OrderFormModal
          onClose={() => setShowOrderForm(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

// ── Micro helpers ────────────────────────────────────────────
const primaryBtn = {
  padding: "0.55rem 1.2rem",
  background: "linear-gradient(135deg,#E8681A,#C8501A)",
  border: "none",
  borderRadius: 7,
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.95rem",
  fontFamily: "'Crimson Pro', serif",
  cursor: "pointer",
};

const searchStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.6rem 0.9rem",
  border: "1.5px solid #D4B896",
  borderRadius: 7,
  fontSize: "1rem",
  fontFamily: "'Crimson Pro', serif",
  background: "#FFFDF8",
  color: "#3A2A1A",
  outline: "none",
};

function Spinner() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem",
        color: "#A89070",
        fontFamily: "'Crimson Pro', serif",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid #E8D9C0",
          borderTop: "3px solid #E8681A",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 0.8rem",
        }}
      />
      लोड होत आहे…
    </div>
  );
}

function Empty({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2.5rem",
        color: "#A89070",
        background: "#FFFDF8",
        borderRadius: 10,
        border: "1px dashed #D4B896",
        fontFamily: "'Crimson Pro', serif",
      }}
    >
      {text}
    </div>
  );
}
