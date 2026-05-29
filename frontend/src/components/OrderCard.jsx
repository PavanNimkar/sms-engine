export default function OrderCard({ order }) {
  const date = new Date(order.created_at).toLocaleDateString("mr-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#FFFDF8",
        border: "1px solid #E8D9C0",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        fontFamily: "'Crimson Pro', serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Name + Amount row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#3A2A1A" }}>
          {order.name}
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#E8681A",
          }}
        >
          ₹{Number(order.total_amount).toLocaleString("mr-IN")}
        </span>
      </div>

      {/* Phone */}
      <div style={{ fontSize: "0.92rem", color: "#6A5040" }}>
        📞 {order.phone_number}
      </div>

      {/* Address */}
      <div style={{ fontSize: "0.92rem", color: "#6A5040", lineHeight: 1.4 }}>
        📍 {order.address}
      </div>

      {/* Date */}
      <div
        style={{ fontSize: "0.78rem", color: "#A89070", marginTop: "0.25rem" }}
      >
        नोंदणी: {date}
      </div>
    </div>
  );
}
