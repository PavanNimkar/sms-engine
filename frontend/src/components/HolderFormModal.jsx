// src/components/HolderFormModal.jsx
// धारक जोडा / संपादित करा — मोडल फॉर्म

import { useState, useEffect } from 'react'

const EMPTY = { serial_number: '', holder_name: '', holder_phone_number: '' }

function validate(f) {
  const e = {}
  if (!f.serial_number.trim())    e.serial_number    = 'अनु. नंबर आवश्यक आहे.'
  if (!f.holder_name.trim())      e.holder_name      = 'नाव आवश्यक आहे.'
  if (f.holder_phone_number && f.holder_phone_number !== '0') {
    const d = f.holder_phone_number.replace(/[\s+\-]/g, '')
    if (!/^\d{10,13}$/.test(d))   e.holder_phone_number = 'वैध फोन नंबर प्रविष्ट करा (१०-१३ अंक).'
  }
  return e
}

// Reusable small input
function Field({ label, name, value, onChange, error, placeholder, type = 'text', inputMode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontSize: '0.83rem', fontWeight: 600, color: '#5A4030', fontFamily: "'Crimson Pro', serif" }}>
        {label}
        {name !== 'holder_phone_number' && <span style={{ color: '#E8681A', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: '0.55rem 0.75rem',
          border: `1.5px solid ${error ? '#dc2626' : '#D4B896'}`,
          borderRadius: 6,
          fontSize: '1rem',
          fontFamily: "'Crimson Pro', serif",
          background: '#FFFDF8',
          color: '#3A2A1A',
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = '#E8681A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,104,26,0.15)' }}
        onBlur={e =>  { e.target.style.borderColor = error ? '#dc2626' : '#D4B896'; e.target.style.boxShadow = 'none' }}
      />
      {error && <span style={{ fontSize: '0.76rem', color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

export default function HolderFormModal({ holder, onClose, onSaved }) {
  const isEdit = Boolean(holder)
  const [fields, setFields] = useState(
    isEdit
      ? { serial_number: holder.serial_number, holder_name: holder.holder_name, holder_phone_number: holder.holder_phone_number ?? '0' }
      : EMPTY
  )
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [serverErr, setServerErr] = useState('')

  function onChange(e) {
    const { name, value } = e.target
    setFields(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerErr('')
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      const token   = localStorage.getItem('auth_token')
      const url     = isEdit ? `/api/holders/${holder.id}/` : '/api/holders/'
      const method  = isEdit ? 'PATCH' : 'POST'
      const res     = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (!res.ok) {
        const first = Object.values(json)[0]
        setServerErr(Array.isArray(first) ? first[0] : String(first))
        return
      }
      onSaved(json.data, isEdit)
    } catch {
      setServerErr('सर्व्हरशी संपर्क होऊ शकला नाही.')
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,18,8,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div style={{
        background: '#FBF5E8', borderRadius: 12, width: '100%', maxWidth: 440,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden',
        fontFamily: "'Crimson Pro', serif",
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#E8681A,#C8501A)',
          padding: '1rem 1.4rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>
            {isEdit ? 'धारक संपादित करा' : 'नवीन धारक जोडा'}
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem',
          }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field
              label="अनु. नंबर"
              name="serial_number"
              value={fields.serial_number}
              onChange={onChange}
              placeholder="उदा. १, २, ३"
              error={errors.serial_number}
            />
            <Field
              label="मिळकत धारकाचे नाव"
              name="holder_name"
              value={fields.holder_name}
              onChange={onChange}
              placeholder="उदा. रामचंद्र विठ्ठल पाटील"
              error={errors.holder_name}
            />
            <Field
              label="फोन नंबर (ऐच्छिक)"
              name="holder_phone_number"
              type="tel"
              inputMode="numeric"
              value={fields.holder_phone_number}
              onChange={onChange}
              placeholder="उदा. 9876543210"
              error={errors.holder_phone_number}
            />

            {serverErr && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: 6, padding: '0.55rem 0.85rem',
                color: '#dc2626', fontSize: '0.88rem',
              }}>{serverErr}</div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.9rem 1.4rem', borderTop: '1px solid #E8D9C0',
            display: 'flex', gap: '0.7rem', justifyContent: 'flex-end',
          }}>
            <button type="button" onClick={onClose} style={{
              padding: '0.5rem 1.1rem', border: '1.5px solid #C8B896',
              borderRadius: 6, background: 'transparent', color: '#7A6040',
              cursor: 'pointer', fontFamily: "'Crimson Pro', serif", fontSize: '1rem',
            }}>रद्द करा</button>
            <button type="submit" disabled={saving} style={{
              padding: '0.5rem 1.3rem', border: 'none', borderRadius: 6,
              background: saving ? '#C8B896' : 'linear-gradient(135deg,#E8681A,#C8501A)',
              color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: "'Crimson Pro', serif", fontSize: '1rem', fontWeight: 700,
            }}>
              {saving ? 'जतन होत आहे…' : isEdit ? 'अद्यतन करा' : 'जोडा'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
