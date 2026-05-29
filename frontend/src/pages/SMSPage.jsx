import { useState, useEffect, useCallback } from "react";
import { smsAPI, messagingAPI } from "../services/api";

const C = {
  bg: "#FBF5E8",
  card: "#FFFDF7",
  border: "#E8DCC8",
  orange: "#E8681A",
  orangeLight: "#FFF0E6",
  dark: "#3A2A1A",
  muted: "#7A6040",
  lightMuted: "#C8B896",
  sent: "#1A7A40",
  sentBg: "#E6F7EE",
  unsent: "#B03010",
  unsentBg: "#FFF0EC",
  hover: "rgba(232,104,26,0.05)",
  baki: "#7A3A1A",
  bakiBg: "#FFF4E0",
  noBaki: "#4A6A1A",
  noBakiBg: "#F0F7E0",
  blue: "#1A4A7A",
  blueBg: "#E6F0FA",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Crimson Pro', 'Georgia', serif",
    color: C.dark,
    paddingBottom: "4rem", // Added padding to the bottom so the button breathes
  },
  topBar: {
    background: C.dark,
    padding: "0.75rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
  orgName: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "0.02em",
  },
  orgSub: { color: C.lightMuted, fontSize: "0.82rem", marginTop: "1px" },
  topBarRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  userBadge: {
    color: C.lightMuted,
    fontSize: "0.9rem",
    fontFamily: "'Crimson Pro', serif",
  },
  logoutBtn: {
    background: "transparent",
    border: `1px solid ${C.lightMuted}`,
    color: C.lightMuted,
    borderRadius: "4px",
    padding: "0.3rem 0.8rem",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontFamily: "'Crimson Pro', serif",
    transition: "all 0.15s",
  },
  controlsWrap: {
    background: C.card,
    borderBottom: `1px solid ${C.border}`,
  },
  controlsRow1: {
    padding: "0.9rem 1.5rem 0.5rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  controlsRow2: {
    padding: "0 1.5rem 0.75rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    gap: "0.35rem",
    alignItems: "center",
  },
  filterGroupLabel: {
    fontSize: "0.75rem",
    color: C.lightMuted,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginRight: "0.15rem",
    whiteSpace: "nowrap",
  },
  divider: {
    width: "1px",
    height: "22px",
    background: C.border,
    margin: "0 0.25rem",
  },
  searchWrap: {
    position: "relative",
    flex: "1 1 240px",
    minWidth: "180px",
    maxWidth: "360px",
  },
  searchIcon: {
    position: "absolute",
    left: "0.7rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.9rem",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "0.48rem 0.75rem 0.48rem 2rem",
    border: `1.5px solid ${C.border}`,
    borderRadius: "6px",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.95rem",
    background: C.bg,
    color: C.dark,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  filterBtn: (active, activeColor, activeBg) => ({
    padding: "0.32rem 0.85rem",
    border: `1.5px solid ${active ? activeColor : C.border}`,
    borderRadius: "20px",
    background: active ? activeBg || activeColor : "transparent",
    color: active ? (activeBg ? activeColor : "#fff") : C.muted,
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.85rem",
    fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  }),
  stats: {
    display: "flex",
    gap: "0.5rem",
    marginLeft: "auto",
    alignItems: "center",
  },
  statBadge: (bg, color) => ({
    padding: "0.28rem 0.75rem",
    background: bg,
    color: color,
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
    fontFamily: "'Crimson Pro', serif",
    letterSpacing: "0.02em",
  }),
  bulkBar: {
    padding: "0.5rem 1.5rem",
    background: C.orangeLight,
    borderBottom: `1px solid #F5CCA0`,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.92rem",
    color: C.orange,
    fontWeight: 600,
    flexWrap: "wrap",
  },
  bulkBtn: (outline, color) => ({
    padding: "0.3rem 0.9rem",
    background: outline ? "transparent" : color || C.orange,
    border: `1.5px solid ${color || C.orange}`,
    color: outline ? color || C.orange : "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.88rem",
    fontWeight: 700,
    transition: "all 0.15s",
  }),
  smsSendBtn: (disabled) => ({
    padding: "0.3rem 1.1rem",
    background: disabled ? "#ccc" : C.blue,
    border: `1.5px solid ${disabled ? "#ccc" : C.blue}`,
    color: "#fff",
    borderRadius: "5px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.88rem",
    fontWeight: 700,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    opacity: disabled ? 0.7 : 1,
  }),
  bottomActionContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "2.5rem 1.5rem",
  },
  mainSendBtn: {
    padding: "0.85rem 2.5rem",
    background: C.orange,
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    boxShadow: "0 4px 14px rgba(232, 104, 26, 0.35)",
    transition: "transform 0.15s, box-shadow 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  tableWrap: { overflowX: "auto", padding: "1rem 1.5rem" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.97rem",
    background: C.card,
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(58,42,26,0.08)",
    border: `1px solid ${C.border}`,
  },
  th: {
    background: "#3A2A1A",
    color: "#C8B896",
    padding: "0.65rem 1rem",
    textAlign: "left",
    fontWeight: 700,
    fontSize: "0.85rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    borderBottom: `2px solid #5A4020`,
  },
  thCenter: { textAlign: "center" },
  td: {
    padding: "0.6rem 1rem",
    borderBottom: `1px solid ${C.border}`,
    color: C.dark,
    verticalAlign: "middle",
  },
  tdMono: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.92rem",
    color: C.muted,
  },
  tdName: { fontWeight: 600, maxWidth: "220px", lineHeight: 1.3 },
  tdBaki: {
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    color: "#B03010",
    fontSize: "0.95rem",
  },
  tdPhone: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.93rem",
    color: "#1A4A7A",
    letterSpacing: "0.04em",
  },
  emptyState: { textAlign: "center", padding: "4rem 2rem", color: C.muted },
  emptyIcon: { fontSize: "3rem", marginBottom: "0.75rem" },
  emptyText: { fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" },
  emptySubtext: { fontSize: "0.9rem", color: C.lightMuted },
  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    gap: "0.75rem",
    color: C.muted,
    fontSize: "1rem",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: `3px solid ${C.border}`,
    borderTop: `3px solid ${C.orange}`,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  spinnerSmall: {
    width: "14px",
    height: "14px",
    border: `2px solid rgba(255,255,255,0.4)`,
    borderTop: `2px solid #fff`,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
    display: "inline-block",
  },
  errorBanner: {
    margin: "1rem 1.5rem 0",
    padding: "0.75rem 1rem",
    background: "#FFF0EC",
    border: "1px solid #F5B8A0",
    borderRadius: "6px",
    color: C.unsent,
    fontSize: "0.92rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  successBanner: {
    margin: "1rem 1.5rem 0",
    padding: "0.75rem 1rem",
    background: C.sentBg,
    border: `1px solid #A8DDB8`,
    borderRadius: "6px",
    color: C.sent,
    fontSize: "0.92rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: C.orange,
  },
  srNo: {
    color: C.lightMuted,
    fontSize: "0.85rem",
    fontFamily: "'Courier New', monospace",
  },
  sentAt: {
    fontSize: "0.78rem",
    color: C.sent,
    marginTop: "2px",
    display: "block",
  },
  // ── Modal ──────────────────────────────────────────────────────────
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  modal: {
    background: C.card,
    borderRadius: "10px",
    boxShadow: "0 8px 32px rgba(58,42,26,0.22)",
    width: "100%",
    maxWidth: "540px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: `1px solid ${C.border}`,
  },
  modalHeader: {
    background: C.dark,
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.05rem",
    margin: 0,
  },
  modalCloseBtn: {
    background: "transparent",
    border: "none",
    color: C.lightMuted,
    fontSize: "1.3rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 0.25rem",
  },
  modalBody: {
    padding: "1.25rem",
    overflowY: "auto",
    flex: 1,
  },
  modalLabel: {
    fontSize: "0.78rem",
    color: C.lightMuted,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "0.35rem",
    display: "block",
  },
  modalSelect: {
    width: "100%",
    padding: "0.55rem 0.75rem",
    border: `1.5px solid ${C.border}`,
    borderRadius: "6px",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.97rem",
    background: C.bg,
    color: C.dark,
    outline: "none",
    marginBottom: "1rem",
    boxSizing: "border-box",
  },
  previewBox: {
    background: "#F5F0E8",
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    padding: "0.85rem 1rem",
    fontSize: "0.97rem",
    color: C.dark,
    lineHeight: 1.6,
    marginBottom: "1rem",
    minHeight: "60px",
    fontFamily: "'Crimson Pro', serif",
  },
  recipientList: {
    maxHeight: "160px",
    overflowY: "auto",
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    marginBottom: "1rem",
  },
  recipientRow: {
    padding: "0.45rem 0.85rem",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  recipientName: { fontWeight: 600, flex: 1 },
  recipientPhone: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.85rem",
    color: C.blue,
  },
  modalFooter: {
    padding: "0.85rem 1.25rem",
    borderTop: `1px solid ${C.border}`,
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    background: C.card,
  },
  resultSummary: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  resultBadge: (bg, color) => ({
    padding: "0.35rem 0.9rem",
    background: bg,
    color: color,
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "0.88rem",
    fontFamily: "'Crimson Pro', serif",
  }),
  resultList: {
    maxHeight: "220px",
    overflowY: "auto",
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
  },
  resultRow: (status) => ({
    padding: "0.45rem 0.85rem",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    fontSize: "0.88rem",
    background:
      status === "sent"
        ? C.sentBg
        : status === "failed"
          ? C.unsentBg
          : "#F5F0E8",
  }),
};

// ── helpers ────────────────────────────────────────────────────
function formatDate(dt) {
  if (!dt) return null;
  return new Date(dt).toLocaleString("mr-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hasBaki(yene_baki) {
  return (
    yene_baki &&
    yene_baki.trim() !== "" &&
    yene_baki.trim() !== "0" &&
    yene_baki.trim() !== "०"
  );
}

// ── SMS Send Modal ─────────────────────────────────────────────
function SmsSendModal({ recordsToSend, onClose, onSent }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [modalError, setModalError] = useState("");

  // Load templates on mount
  useEffect(() => {
    messagingAPI
      .listTemplates()
      .then((res) => {
        setTemplates(res.data);
        if (res.data.length === 1) setSelectedTemplateId(res.data[0].sms_id);
      })
      .catch(() => setModalError("Templates लोड करताना त्रुटी आली."))
      .finally(() => setLoadingTemplates(false));
  }, []);

  // Auto-preview when template changes (use first selected record)
  useEffect(() => {
    if (!selectedTemplateId || recordsToSend.length === 0) {
      setPreviewText("");
      return;
    }
    setLoadingPreview(true);
    setPreviewText("");
    messagingAPI
      .previewSms({
        sms_id: selectedTemplateId,
        tax_record_id: recordsToSend[0].id,
      })
      .then((res) => setPreviewText(res.data.rendered_message))
      .catch(() => setPreviewText("Preview उपलब्ध नाही."))
      .finally(() => setLoadingPreview(false));
  }, [selectedTemplateId, recordsToSend]);

  async function handleSend() {
    if (!selectedTemplateId) {
      setModalError("कृपया एक template निवडा.");
      return;
    }
    setSending(true);
    setModalError("");
    try {
      const res = await messagingAPI.sendSms({
        sms_id: selectedTemplateId,
        tax_record_ids: recordsToSend.map((r) => r.id),
      });
      setSendResult(res.data);
      onSent(res.data);
    } catch (e) {
      setModalError(
        e?.response?.data?.error ||
          "SMS पाठवताना त्रुटी आली. पुन्हा प्रयत्न करा.",
      );
    } finally {
      setSending(false);
    }
  }

  const sentCount = sendResult?.summary?.sent ?? 0;
  const failedCount = sendResult?.summary?.failed ?? 0;
  const skippedCount = sendResult?.summary?.skipped ?? 0;

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && !sending && onClose()}
    >
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            📱 SMS पाठवा — {recordsToSend.length} प्राप्तकर्ते
          </h2>
          {!sending && (
            <button style={styles.modalCloseBtn} onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.modalBody}>
          {modalError && (
            <div
              style={{
                ...styles.errorBanner,
                margin: "0 0 1rem 0",
              }}
            >
              ⚠️ {modalError}
            </div>
          )}

          {/* After send — show results */}
          {sendResult ? (
            <>
              <div style={styles.resultSummary}>
                <span style={styles.resultBadge(C.sentBg, C.sent)}>
                  ✓ पाठवले: {sentCount}
                </span>
                {failedCount > 0 && (
                  <span style={styles.resultBadge(C.unsentBg, C.unsent)}>
                    ✗ अयशस्वी: {failedCount}
                  </span>
                )}
                {skippedCount > 0 && (
                  <span style={styles.resultBadge("#F5F0E8", C.muted)}>
                    वगळले: {skippedCount}
                  </span>
                )}
              </div>
              <div style={styles.resultList}>
                {sendResult.results.map((r, i) => (
                  <div key={i} style={styles.resultRow(r.status)}>
                    <span style={{ fontWeight: 600, flex: 1 }}>
                      {r.holder_name || `ID: ${r.tax_record_id}`}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.82rem",
                        color: C.blue,
                      }}
                    >
                      {r.phone_number || "—"}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color:
                          r.status === "sent"
                            ? C.sent
                            : r.status === "failed"
                              ? C.unsent
                              : C.muted,
                      }}
                    >
                      {r.status === "sent"
                        ? "✓ पाठवला"
                        : r.status === "failed"
                          ? "✗ अयशस्वी"
                          : "वगळले"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Template selector */}
              <label style={styles.modalLabel}>SMS Template निवडा</label>
              {loadingTemplates ? (
                <div
                  style={{
                    color: C.muted,
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  Templates लोड होत आहेत…
                </div>
              ) : templates.length === 0 ? (
                <div
                  style={{
                    color: C.unsent,
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  कोणताही template उपलब्ध नाही. Admin मध्ये template तयार करा.
                </div>
              ) : (
                <select
                  style={styles.modalSelect}
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                >
                  <option value="">— template निवडा —</option>
                  {templates.map((t) => (
                    <option key={t.sms_id} value={t.sms_id}>
                      {t.sms_id}
                    </option>
                  ))}
                </select>
              )}

              {/* Preview */}
              {selectedTemplateId && (
                <>
                  <label style={styles.modalLabel}>
                    संदेश preview ({recordsToSend[0]?.holder_name} साठी)
                  </label>
                  <div style={styles.previewBox}>
                    {loadingPreview ? (
                      <span style={{ color: C.muted }}>
                        Preview लोड होत आहे…
                      </span>
                    ) : (
                      previewText || (
                        <span style={{ color: C.lightMuted }}>—</span>
                      )
                    )}
                  </div>
                </>
              )}

              {/* Recipients */}
              <label style={styles.modalLabel}>
                प्राप्तकर्ते ({recordsToSend.length})
              </label>
              <div style={styles.recipientList}>
                {recordsToSend.map((r) => (
                  <div key={r.id} style={styles.recipientRow}>
                    <span style={styles.recipientName}>{r.holder_name}</span>
                    <span style={styles.recipientPhone}>
                      {r.holder_phone_number}
                    </span>
                    {hasBaki(r.yene_baki) && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: C.unsent,
                        }}
                      >
                        ₹{r.yene_baki}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          {sendResult ? (
            <button style={styles.bulkBtn(false, C.sent)} onClick={onClose}>
              बंद करा
            </button>
          ) : (
            <>
              <button
                style={styles.bulkBtn(true)}
                onClick={onClose}
                disabled={sending}
              >
                रद्द करा
              </button>
              <button
                style={styles.smsSendBtn(
                  sending || !selectedTemplateId || templates.length === 0,
                )}
                onClick={handleSend}
                disabled={
                  sending || !selectedTemplateId || templates.length === 0
                }
              >
                {sending ? (
                  <>
                    <span style={styles.spinnerSmall} />
                    पाठवत आहे…
                  </>
                ) : (
                  <>📤 SMS पाठवा</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function SMSPage({ user, onLogout }) {
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [smsFilter, setSmsFilter] = useState("all");
  const [bakiFilter, setBakiFilter] = useState("all");

  const [selected, setSelected] = useState(new Set());

  // This state tells the modal which records to send the message to
  const [recordsToSend, setRecordsToSend] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (smsFilter === "sent") params.sms_sent = "true";
      if (smsFilter === "unsent") params.sms_sent = "false";
      const res = await smsAPI.list(params);
      setAllRecords(res.data);
    } catch {
      setError("डेटा लोड करताना त्रुटी आली. पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
  }, [search, smsFilter]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  // ── client-side baki filter ────────────────────────────────────
  useEffect(() => {
    if (bakiFilter === "has_baki") {
      setRecords(allRecords.filter((r) => hasBaki(r.yene_baki)));
    } else if (bakiFilter === "no_baki") {
      setRecords(allRecords.filter((r) => !hasBaki(r.yene_baki)));
    } else {
      setRecords(allRecords);
    }
    setSelected(new Set());
  }, [allRecords, bakiFilter]);

  // ── stats ──────────────────────────────────────────────────────
  const sentCount = records.filter((r) => r.sms_sent).length;
  const unsentCount = records.filter((r) => !r.sms_sent).length;
  const bakiCount = records.filter((r) => hasBaki(r.yene_baki)).length;
  const noBakiCount = records.filter((r) => !hasBaki(r.yene_baki)).length;

  // ── bulk toggle ────────────────────────────────────────────────
  async function handleBulkToggle(sentValue) {
    if (selected.size === 0) return;
    const ids = [...selected];
    try {
      await smsAPI.bulkToggle(ids, sentValue);
      setAllRecords((prev) =>
        prev.map((r) =>
          ids.includes(r.id)
            ? {
                ...r,
                sms_sent: sentValue,
                sent_at: sentValue ? new Date().toISOString() : null,
              }
            : r,
        ),
      );
      setSelected(new Set());
    } catch {
      setError("Bulk update करताना त्रुटी आली.");
    }
  }

  // ── after SMS sent via modal ───────────────────────────────────
  function handleSmsSent(result) {
    const { sent, total } = result.summary;
    setSuccess(`✓ ${sent}/${total} SMS यशस्वीरित्या पाठवले गेले.`);
    fetchData(); // refresh to reflect updated sms_sent status
    setTimeout(() => setSuccess(""), 6000);
  }

  // ── selection ──────────────────────────────────────────────────
  function toggleSelect(id) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleSelectAll() {
    setSelected(
      selected.size === records.length
        ? new Set()
        : new Set(records.map((r) => r.id)),
    );
  }
  const allSelected = records.length > 0 && selected.size === records.length;

  const selectedRecords = records.filter((r) => selected.has(r.id));

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── SMS Send Modal ── */}
      {showSendModal && (
        <SmsSendModal
          recordsToSend={recordsToSend}
          onClose={() => setShowSendModal(false)}
          onSent={(result) => {
            setShowSendModal(false);
            handleSmsSent(result);
          }}
        />
      )}

      {/* ── Top Bar ── */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div>
            <div style={styles.orgName}>SMS नोंदणी</div>
            <div style={styles.orgSub}>
              थकबाकी SMS ट्रॅकर — ग्रामपंचायत औरवाड
            </div>
          </div>
        </div>
        <div style={styles.topBarRight}>
          <span style={styles.userBadge}>👤 {user?.username}</span>
          <button
            style={styles.logoutBtn}
            onClick={onLogout}
            onMouseOver={(e) => {
              e.target.style.color = "#fff";
              e.target.style.borderColor = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.color = C.lightMuted;
              e.target.style.borderColor = C.lightMuted;
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={styles.controlsWrap}>
        <div style={styles.controlsRow1}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="नाव, अनु. नंबर, फोन शोधा…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelected(new Set());
              }}
              style={styles.searchInput}
            />
          </div>

          {!loading && (
            <div style={styles.stats}>
              <span style={styles.statBadge(C.sentBg, C.sent)}>
                ✓ SMS {sentCount}
              </span>
              <span style={styles.statBadge(C.unsentBg, C.unsent)}>
                ✗ SMS {unsentCount}
              </span>
              <span style={styles.statBadge(C.bakiBg, C.baki)}>
                ₹ बाकी {bakiCount}
              </span>
              <span style={styles.statBadge(C.noBakiBg, C.noBaki)}>
                ✓ चुकता {noBakiCount}
              </span>
              <span style={styles.statBadge("#EEE8DC", C.muted)}>
                एकूण {records.length}
              </span>
            </div>
          )}
        </div>

        <div style={styles.controlsRow2}>
          <span style={styles.filterGroupLabel}>SMS</span>
          <div style={styles.filterGroup}>
            {[
              { key: "all", label: "सर्व" },
              { key: "sent", label: "✓ पाठवले", ac: C.sent, ab: C.sentBg },
              {
                key: "unsent",
                label: "✗ न पाठवलेले",
                ac: C.unsent,
                ab: C.unsentBg,
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setSmsFilter(f.key);
                  setSelected(new Set());
                }}
                style={styles.filterBtn(
                  smsFilter === f.key,
                  f.ac || C.orange,
                  f.ab,
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={styles.divider} />

          <span style={styles.filterGroupLabel}>येणे बाकी</span>
          <div style={styles.filterGroup}>
            {[
              { key: "all", label: "सर्व" },
              {
                key: "has_baki",
                label: "₹ बाकी आहे",
                ac: C.baki,
                ab: C.bakiBg,
              },
              {
                key: "no_baki",
                label: "✓ चुकता",
                ac: C.noBaki,
                ab: C.noBakiBg,
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setBakiFilter(f.key);
                  setSelected(new Set());
                }}
                style={styles.filterBtn(
                  bakiFilter === f.key,
                  f.ac || C.orange,
                  f.ab,
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div style={styles.bulkBar}>
          <span>{selected.size} निवडले</span>
          {/* ── SMS Send Button (For specific selections) ── */}
          <button
            style={styles.smsSendBtn(false)}
            onClick={() => {
              setRecordsToSend(selectedRecords);
              setShowSendModal(true);
            }}
          >
            📤 निवडलेल्यांना SMS पाठवा
          </button>
          <div style={styles.divider} />
          <button
            style={styles.bulkBtn(false)}
            onClick={() => handleBulkToggle(true)}
          >
            ✓ SMS पाठवला म्हणून चिन्हांकित
          </button>
          <button
            style={styles.bulkBtn(true)}
            onClick={() => handleBulkToggle(false)}
          >
            ✗ न पाठवलेले म्हणून चिन्हांकित
          </button>
          <button
            style={{
              ...styles.bulkBtn(true),
              borderColor: C.muted,
              color: C.muted,
              marginLeft: "auto",
            }}
            onClick={() => setSelected(new Set())}
          >
            रद्द करा
          </button>
        </div>
      )}

      {/* ── Success Banner ── */}
      {success && (
        <div style={styles.successBanner}>
          {success}
          <button
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.sent,
              fontSize: "1rem",
            }}
            onClick={() => setSuccess("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
          <button
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.unsent,
              fontSize: "1rem",
            }}
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            डेटा लोड होत आहे…
          </div>
        ) : records.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <div style={styles.emptyText}>कोणत्याही नोंदी आढळल्या नाहीत</div>
            <div style={styles.emptySubtext}>
              {search
                ? `"${search}" साठी परिणाम नाही`
                : "निवडलेल्या फिल्टरसाठी नोंदी नाहीत"}
            </div>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, width: "40px", textAlign: "center" }}
                >
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    title="सर्व निवडा"
                  />
                </th>
                <th style={styles.th}>अनु. क्र.</th>
                <th style={styles.th}>मिळकत धारकाचे नाव</th>
                <th style={styles.th}>येणे बाकी</th>
                <th style={styles.th}>फोन नंबर</th>
                <th style={{ ...styles.th, ...styles.thCenter }}>SMS पाठवला</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{
                    background: selected.has(row.id)
                      ? "rgba(232,104,26,0.07)"
                      : idx % 2 === 0
                        ? C.card
                        : C.bg,
                  }}
                  onMouseOver={(e) => {
                    if (!selected.has(row.id))
                      e.currentTarget.style.background = C.hover;
                  }}
                  onMouseOut={(e) => {
                    if (!selected.has(row.id))
                      e.currentTarget.style.background =
                        idx % 2 === 0 ? C.card : C.bg;
                  }}
                >
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td style={{ ...styles.td, ...styles.tdMono }}>
                    <span style={styles.srNo}>
                      {row.serial_number || `#${idx + 1}`}
                    </span>
                  </td>
                  <td style={{ ...styles.td, ...styles.tdName }}>
                    {row.holder_name}
                  </td>
                  <td style={{ ...styles.td, ...styles.tdBaki }}>
                    {hasBaki(row.yene_baki) ? (
                      `₹ ${row.yene_baki}`
                    ) : (
                      <span
                        style={{
                          color: C.noBaki,
                          fontWeight: 700,
                          fontSize: "0.88rem",
                        }}
                      >
                        ✓ चुकता
                      </span>
                    )}
                  </td>
                  <td style={{ ...styles.td, ...styles.tdPhone }}>
                    {row.holder_phone_number}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {/* Rendered as static pill instead of clickable button */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        background: row.sms_sent ? C.sentBg : C.unsentBg,
                        color: row.sms_sent ? C.sent : C.unsent,
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        border: `1.5px solid ${row.sms_sent ? "#A8DDB8" : "#F5B8A0"}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.sms_sent ? "✓ पाठवला" : "✗ नाही"}
                    </span>
                    {row.sms_sent && row.sent_at && (
                      <span style={styles.sentAt}>
                        {formatDate(row.sent_at)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Main Send SMS Button (Bottom Middle) ── */}
      {records.length > 0 && !loading && (
        <div style={styles.bottomActionContainer}>
          <button
            style={styles.mainSendBtn}
            onClick={() => {
              setRecordsToSend(records);
              setShowSendModal(true);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(232, 104, 26, 0.45)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(232, 104, 26, 0.35)";
            }}
          >
            📤 सर्व {records.length} धारकांना SMS पाठवा
          </button>
        </div>
      )}
    </div>
  );
}
