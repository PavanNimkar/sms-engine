export default function OrderFormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  inputMode,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        htmlFor={name}
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "#5A4030",
          fontFamily: "'Crimson Pro', serif",
          letterSpacing: "0.01em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#E8681A", marginLeft: "3px" }}>*</span>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          style={{
            padding: "0.6rem 0.75rem",
            border: error ? "1.5px solid #dc2626" : "1.5px solid #D4B896",
            borderRadius: "6px",
            fontSize: "1rem",
            fontFamily: "'Crimson Pro', serif",
            background: "#FFFDF8",
            color: "#3A2A1A",
            resize: "vertical",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#E8681A";
            e.target.style.boxShadow = "0 0 0 3px rgba(232,104,26,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#dc2626" : "#D4B896";
            e.target.style.boxShadow = "none";
          }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            padding: "0.6rem 0.75rem",
            border: error ? "1.5px solid #dc2626" : "1.5px solid #D4B896",
            borderRadius: "6px",
            fontSize: "1rem",
            fontFamily: "'Crimson Pro', serif",
            background: "#FFFDF8",
            color: "#3A2A1A",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#E8681A";
            e.target.style.boxShadow = "0 0 0 3px rgba(232,104,26,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#dc2626" : "#D4B896";
            e.target.style.boxShadow = "none";
          }}
        />
      )}

      {error && (
        <span style={{ fontSize: "0.78rem", color: "#dc2626" }}>{error}</span>
      )}
    </div>
  );
}
