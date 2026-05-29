import { useState, useEffect, useCallback } from "react";
import { recordsAPI, authAPI } from "../services/api";

export default function RecordsPage({ user, onLogout }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (pageFilter) params.page_number = pageFilter;
      const res = await recordsAPI.list(params);
      setRecords(res.data);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  }, [search, pageFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchRecords, 300);
    return () => clearTimeout(timer);
  }, [fetchRecords]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    onLogout();
  };

  const hasBaki = (record) =>
    record.yene_baki &&
    record.yene_baki !== "०" &&
    record.yene_baki !== "0" &&
    record.yene_baki !== "";

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.orgBadge}>🏛</div>
          <div>
            <div style={styles.orgName}>ग्रामपंचायत औरवाड</div>
            <div style={styles.orgSub}>
              नमुना नंबर १ — मागणी रजिस्टर २०२५-२६
            </div>
          </div>
        </div>
        <div style={styles.topBarRight}>
          <span style={styles.userBadge}>👤 {user.username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or property number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>
        <select
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          style={styles.pageSelect}
        >
          <option value="">All Pages</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              पान {p}
            </option>
          ))}
        </select>
        <div style={styles.countBadge}>
          {loading
            ? "..."
            : `${records.length} record${records.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Error state */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Table */}
      <div style={styles.tableOuter}>
        <div style={styles.tableScroll}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner} />
              <span>Loading records…</span>
            </div>
          ) : records.length === 0 ? (
            <div style={styles.empty}>
              <span style={{ fontSize: "2rem" }}>📋</span>
              <p>No records found</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thSticky }} rowSpan={2}>
                    अनु. नं.
                  </th>
                  <th style={{ ...styles.th, ...styles.thName }} rowSpan={2}>
                    मिळकत नंबर / नाव
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      ...styles.thGroup,
                      background: "#D4532A",
                    }}
                    colSpan={6}
                  >
                    मागणी
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      ...styles.thGroup,
                      background: "#3D6B26",
                    }}
                    colSpan={6}
                  >
                    वसूली
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      ...styles.thGroup,
                      background: "#7A3A1A",
                    }}
                    rowSpan={2}
                  >
                    येणे बाकी
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      ...styles.thGroup,
                      background: "#555",
                    }}
                    rowSpan={2}
                  >
                    पान
                  </th>
                </tr>
                <tr>
                  {[
                    "घरपट्टी",
                    "आरोग्य",
                    "दिवाबत्ती",
                    "पाणीपट्टी",
                    "5% दंड",
                    "एकूण",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        ...styles.th,
                        background: "#B84025",
                        fontSize: "0.68rem",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                  {[
                    "घरपट्टी",
                    "आरोग्य",
                    "दिवाबत्ती",
                    "पाणीपट्टी",
                    "दंड",
                    "एकूण",
                  ].map((h) => (
                    <th
                      key={"v" + h}
                      style={{
                        ...styles.th,
                        background: "#2E5C1E",
                        fontSize: "0.68rem",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r.id}
                    style={{
                      ...styles.tr,
                      background: hasBaki(r) ? "#FFF5F0" : "#F8FBED",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td
                      style={{
                        ...styles.td,
                        ...styles.tdMono,
                        textAlign: "center",
                      }}
                    >
                      {r.serial_number}
                    </td>
                    <td style={{ ...styles.td, ...styles.tdName }}>
                      <div style={styles.propNum}>{r.property_number}</div>
                      <div style={styles.holderName}>{r.holder_name}</div>
                    </td>
                    {/* DEMAND totals */}
                    <td style={styles.td}>
                      <TaxCell val={r.demand_gharpatii_total} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.demand_arogya_total} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.demand_divabatti_total} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.demand_paani_total} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.demand_dand_total} />
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      <TaxCell val={r.demand_total_ekun} />
                    </td>
                    {/* COLLECTION */}
                    <td style={styles.td}>
                      <TaxCell val={r.vasuli_gharpatii} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.vasuli_arogya} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.vasuli_divabatti} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.vasuli_paani} />
                    </td>
                    <td style={styles.td}>
                      <TaxCell val={r.vasuli_dand} />
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      <TaxCell val={r.vasuli_total} />
                    </td>
                    {/* BALANCE */}
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        color: hasBaki(r) ? "#B82A2A" : "#2A7A3B",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {r.yene_baki || "—"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        ...styles.tdMono,
                        textAlign: "center",
                      }}
                    >
                      {r.page_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}

function TaxCell({ val }) {
  if (!val) return <span style={{ color: "#C8B896" }}>—</span>;
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>
      {val}
    </span>
  );
}

function RecordModal({ record, onClose }) {
  const hasBaki =
    record.yene_baki &&
    record.yene_baki !== "०" &&
    record.yene_baki !== "0" &&
    record.yene_baki !== "";

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.card} onClick={(e) => e.stopPropagation()}>
        <div style={modal.header}>
          <div>
            <div style={modal.propNum}>{record.property_number}</div>
            <div style={modal.holderName}>{record.holder_name}</div>
          </div>
          <button onClick={onClose} style={modal.closeBtn}>
            ✕
          </button>
        </div>

        <div style={modal.meta}>
          <span style={modal.metaBadge}>अनु. नं. {record.serial_number}</span>
          <span style={modal.metaBadge}>पान {record.page_number}</span>
          <span
            style={{
              ...modal.metaBadge,
              background: hasBaki ? "#FEE8E0" : "#E8F5EC",
              color: hasBaki ? "#B82A2A" : "#2A7A3B",
            }}
          >
            {hasBaki ? `बाकी: ${record.yene_baki}` : "पूर्ण भरले ✓"}
          </span>
        </div>

        <div style={modal.sections}>
          <SectionTable
            title="मागणी (Tax Demand)"
            color="#E8681A"
            rows={[
              ["", "मागील", "चालू", "एकूण"],
              [
                "घरपट्टी",
                record.demand_gharpatii_previous,
                record.demand_gharpatii_current,
                record.demand_gharpatii_total,
              ],
              [
                "आरोग्य",
                record.demand_arogya_previous,
                record.demand_arogya_current,
                record.demand_arogya_total,
              ],
              [
                "दिवाबत्ती",
                record.demand_divabatti_previous,
                record.demand_divabatti_current,
                record.demand_divabatti_total,
              ],
              [
                "पाणीपट्टी",
                record.demand_paani_previous,
                record.demand_paani_current,
                record.demand_paani_total,
              ],
              [
                "5% दंड/सूट",
                record.demand_dand_previous,
                record.demand_dand_current,
                record.demand_dand_total,
              ],
              [
                "एकूण",
                record.demand_total_previous,
                record.demand_total_current,
                record.demand_total_ekun,
              ],
            ]}
          />

          <SectionTable
            title="वसूली (Collection)"
            color="#5C6B2E"
            rows={[
              ["", "रक्कम"],
              ["घरपट्टी", record.vasuli_gharpatii],
              ["आरोग्य", record.vasuli_arogya],
              ["दिवाबत्ती", record.vasuli_divabatti],
              ["पाणीपट्टी", record.vasuli_paani],
              ["5% दंड/सूट", record.vasuli_dand],
              ["एकूण", record.vasuli_total],
            ]}
          />
        </div>

        <div style={modal.receiptSection}>
          <div style={modal.receiptRow}>
            <span style={modal.receiptLabel}>३१ डिसें पूर्वी पावती:</span>
            <span style={modal.receiptVal}>
              {record.receipt_before_dec31 || "—"}
            </span>
          </div>
          <div style={modal.receiptRow}>
            <span style={modal.receiptLabel}>पावती दिनांक:</span>
            <span style={modal.receiptVal}>
              {record.receipt_after_dec31 || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTable({ title, color, rows }) {
  return (
    <div style={modal.sectionWrap}>
      <div style={{ ...modal.sectionTitle, color }}>{title}</div>
      <table style={modal.innerTable}>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background:
                  i === 0 ? color + "18" : i % 2 === 0 ? "#FBF5E8" : "#FFFDF5",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    ...modal.innerTd,
                    fontWeight: i === 0 || j === 0 ? "600" : "400",
                    fontFamily:
                      i > 0 && j > 0 ? "'DM Mono', monospace" : "inherit",
                    color: !cell ? "#C8B896" : "inherit",
                  }}
                >
                  {cell || (i > 0 && j > 0 ? "—" : cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FBF5E8",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    background: "linear-gradient(135deg, #1A1209 0%, #3A2810 100%)",
    padding: "0.9rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "3px solid #E8681A",
    boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "0.9rem" },
  orgBadge: {
    fontSize: "1.6rem",
    background: "linear-gradient(135deg, #E8681A, #C04F0F)",
    borderRadius: "8px",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    color: "#FBF5E8",
    fontSize: "1.05rem",
    fontWeight: "700",
  },
  orgSub: {
    fontFamily: "'Crimson Pro', serif",
    color: "#C8A870",
    fontSize: "0.78rem",
  },
  topBarRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  userBadge: {
    fontFamily: "'DM Mono', monospace",
    color: "#C8A870",
    fontSize: "0.78rem",
    background: "rgba(255,255,255,0.08)",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(200,168,112,0.3)",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(232,104,26,0.5)",
    color: "#E8681A",
    padding: "5px 14px",
    borderRadius: "6px",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    background: "#EDE4CC",
    borderBottom: "1px solid #C8B896",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    alignItems: "center",
    background: "#FFFDF5",
    border: "1.5px solid #C8B896",
    borderRadius: "8px",
    padding: "0 0.6rem",
    gap: "0.5rem",
  },
  searchIcon: { fontSize: "0.9rem", color: "#9A8060" },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "0.55rem 0",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "0.9rem",
    color: "#1A1209",
    outline: "none",
  },
  clearBtn: {
    background: "transparent",
    border: "none",
    color: "#9A8060",
    cursor: "pointer",
    fontSize: "0.8rem",
    padding: "0 2px",
  },
  pageSelect: {
    padding: "0.55rem 0.75rem",
    border: "1.5px solid #C8B896",
    borderRadius: "8px",
    background: "#FFFDF5",
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "0.85rem",
    color: "#1A1209",
    cursor: "pointer",
    outline: "none",
  },
  countBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.75rem",
    color: "#7A6040",
    background: "#D4C8A8",
    padding: "4px 10px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
  },
  errorBox: {
    margin: "0.75rem 1.5rem",
    background: "#FEE8E0",
    border: "1px solid #E8A090",
    borderRadius: "8px",
    padding: "0.6rem 1rem",
    color: "#B82A2A",
    fontSize: "0.85rem",
  },
  tableOuter: {
    flex: 1,
    padding: "1rem 1.5rem",
  },
  tableScroll: {
    overflowX: "auto",
    borderRadius: "10px",
    border: "1px solid #C8B896",
    boxShadow: "0 2px 16px rgba(26,18,9,0.08)",
    background: "#FFFDF5",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "3rem",
    color: "#7A6040",
    fontFamily: "'Crimson Pro', serif",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #C8B896",
    borderTop: "3px solid #E8681A",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "3rem",
    color: "#9A8060",
    fontFamily: "'Crimson Pro', serif",
    fontSize: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.82rem",
    minWidth: "1000px",
  },
  th: {
    padding: "0.55rem 0.65rem",
    background: "#C04F0F",
    color: "#FBF5E8",
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.15)",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  thSticky: {
    left: 0,
    zIndex: 3,
    background: "#8A3010",
    minWidth: "55px",
  },
  thName: {
    left: "55px",
    zIndex: 3,
    background: "#8A3010",
    minWidth: "180px",
    textAlign: "left",
  },
  thGroup: {
    fontSize: "0.75rem",
    letterSpacing: "0.01em",
  },
  tr: {
    borderBottom: "1px solid #EDE4CC",
    transition: "background 0.15s",
  },
  td: {
    padding: "0.5rem 0.6rem",
    textAlign: "right",
    verticalAlign: "middle",
    fontSize: "0.8rem",
    color: "#1A1209",
    border: "1px solid #EDE4CC",
  },
  tdMono: { fontFamily: "'DM Mono', monospace" },
  tdName: {
    textAlign: "left",
    padding: "0.5rem 0.75rem",
    minWidth: "180px",
    maxWidth: "240px",
  },
  propNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.75rem",
    color: "#E8681A",
    fontWeight: "600",
    marginBottom: "2px",
  },
  holderName: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "0.82rem",
    color: "#1A1209",
    lineHeight: "1.3",
  },
};

const modal = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,18,9,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "1rem",
  },
  card: {
    background: "#FFFDF5",
    border: "1px solid #C8B896",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "88vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(26,18,9,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.25rem 1.5rem",
    borderBottom: "2px solid #E8681A",
    background: "linear-gradient(135deg, #FBF5E8, #EDE4CC)",
  },
  propNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.85rem",
    color: "#E8681A",
    fontWeight: "600",
    marginBottom: "4px",
  },
  holderName: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "1.15rem",
    color: "#1A1209",
    fontWeight: "700",
    maxWidth: "400px",
  },
  closeBtn: {
    background: "transparent",
    border: "1px solid #C8B896",
    borderRadius: "6px",
    color: "#7A6040",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  meta: {
    display: "flex",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    flexWrap: "wrap",
  },
  metaBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.73rem",
    background: "#EDE4CC",
    color: "#5C4A28",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid #C8B896",
  },
  sections: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    padding: "0 1.5rem 1rem",
  },
  sectionWrap: {},
  sectionTitle: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    fontSize: "0.85rem",
    fontWeight: "700",
    marginBottom: "0.4rem",
    letterSpacing: "0.01em",
  },
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #C8B896",
    borderRadius: "6px",
    overflow: "hidden",
    fontSize: "0.78rem",
  },
  innerTd: {
    padding: "0.35rem 0.55rem",
    border: "1px solid #EDE4CC",
    color: "#1A1209",
  },
  receiptSection: {
    padding: "0.75rem 1.5rem 1.25rem",
    borderTop: "1px solid #EDE4CC",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  receiptRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.8rem",
  },
  receiptLabel: {
    fontFamily: "'Tiro Devanagari Marathi', serif",
    color: "#5C4A28",
    minWidth: "200px",
    fontWeight: "600",
  },
  receiptVal: {
    fontFamily: "'DM Mono', monospace",
    color: "#1A1209",
    background: "#EDE4CC",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.78rem",
  },
};
