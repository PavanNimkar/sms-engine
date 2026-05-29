import { useState } from "react";
import OrderFormInput from "./OrderFormInput";

const EMPTY = { name: "", phone_number: "", total_amount: "", address: "" };

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = "नाव आवश्यक आहे.";
  if (!fields.phone_number.trim()) {
    errors.phone_number = "फोन नंबर आवश्यक आहे.";
  } else {
    const digits = fields.phone_number.replace(/[\s+\-]/g, "");
    if (!/^\d{10,13}$/.test(digits))
      errors.phone_number = "वैध फोन नंबर प्रविष्ट करा (१०-१३ अंक).";
  }
  if (!fields.total_amount) {
    errors.total_amount = "एकूण रक्कम आवश्यक आहे.";
  } else if (
    isNaN(Number(fields.total_amount)) ||
    Number(fields.total_amount) <= 0
  ) {
    errors.total_amount = "वैध रक्कम प्रविष्ट करा.";
  }
  if (!fields.address.trim()) errors.address = "पत्ता आवश्यक आहे.";
  return errors;
}

export default function OrderFormModal({ onClose, onSuccess }) {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ...fields,
          total_amount: Number(fields.total_amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Show first field error or generic message
        const firstError = Object.values(data)[0];
        setServerError(
          Array.isArray(firstError) ? firstError[0] : String(firstError),
        );
        return;
      }
      onSuccess(data.data);
    } catch {
      setServerError("सर्व्हरशी संपर्क होऊ शकला नाही. पुन्हा प्रयत्न करा.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,18,8,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      {/* Modal card */}
      <div
        style={{
          background: "#FBF5E8",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
          fontFamily: "'Crimson Pro', serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #E8681A 0%, #C8501A 100%)",
            padding: "1.1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            नवीन ऑर्डर नोंदणी
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <OrderFormInput
              label="नाव"
              name="name"
              value={fields.name}
              onChange={handleChange}
              placeholder="उदा. रामचंद्र पाटील"
              error={errors.name}
              required
            />

            <OrderFormInput
              label="फोन नंबर"
              name="phone_number"
              type="tel"
              inputMode="numeric"
              value={fields.phone_number}
              onChange={handleChange}
              placeholder="उदा. 9876543210"
              error={errors.phone_number}
              required
            />

            <OrderFormInput
              label="एकूण रक्कम (₹)"
              name="total_amount"
              type="number"
              inputMode="decimal"
              value={fields.total_amount}
              onChange={handleChange}
              placeholder="उदा. 1500.00"
              error={errors.total_amount}
              required
            />

            <OrderFormInput
              label="पत्ता"
              name="address"
              type="textarea"
              value={fields.address}
              onChange={handleChange}
              placeholder="उदा. मु. पो. औरवाड, ता. हातकणंगले, जि. कोल्हापूर"
              error={errors.address}
              required
            />

            {serverError && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "6px",
                  padding: "0.6rem 0.9rem",
                  color: "#dc2626",
                  fontSize: "0.9rem",
                }}
              >
                {serverError}
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #E8D9C0",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.55rem 1.2rem",
                border: "1.5px solid #C8B896",
                borderRadius: "6px",
                background: "transparent",
                color: "#7A6040",
                cursor: "pointer",
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1rem",
              }}
            >
              रद्द करा
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.55rem 1.4rem",
                border: "none",
                borderRadius: "6px",
                background: submitting
                  ? "#C8B896"
                  : "linear-gradient(135deg, #E8681A 0%, #C8501A 100%)",
                color: "#fff",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1rem",
                fontWeight: 700,
              }}
            >
              {submitting ? "जतन होत आहे…" : "जतन करा"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
