// src/components/HolderRow.jsx
// तक्त्यातील एकल धारक ओळ — संपादित / हटवा बटणांसह

export default function HolderRow({ holder, onEdit, onDelete, deleting }) {
  const phone = holder.holder_phone_number && holder.holder_phone_number !== '0'
    ? holder.holder_phone_number
    : '—'

  return (
    <tr style={{ borderBottom: '1px solid #EEE0CC' }}>
      {/* अनु. नंबर */}
      <td style={tdStyle('#F5EFE4')}>{holder.serial_number}</td>

      {/* नाव */}
      <td style={tdStyle()}>
        <span style={{ fontWeight: 600, color: '#3A2A1A' }}>{holder.holder_name}</span>
      </td>

      {/* फोन */}
      <td style={tdStyle()}>
        <span style={{ color: phone === '—' ? '#C8B896' : '#3A2A1A' }}>{phone}</span>
      </td>

      {/* क्रिया */}
      <td style={{ ...tdStyle(), whiteSpace: 'nowrap' }}>
        <button
          onClick={() => onEdit(holder)}
          title="संपादित करा"
          style={actionBtn('#E8681A')}
        >
          ✏️ संपादित
        </button>
        <button
          onClick={() => onDelete(holder)}
          disabled={deleting === holder.id}
          title="हटवा"
          style={actionBtn('#dc2626', deleting === holder.id)}
        >
          {deleting === holder.id ? '…' : '🗑 हटवा'}
        </button>
      </td>
    </tr>
  )
}

function tdStyle(bg) {
  return {
    padding: '0.65rem 0.9rem',
    fontSize: '0.95rem',
    fontFamily: "'Crimson Pro', serif",
    color: '#5A4030',
    background: bg || 'transparent',
    verticalAlign: 'middle',
  }
}

function actionBtn(color, disabled = false) {
  return {
    marginRight: '0.4rem',
    padding: '0.3rem 0.7rem',
    border: `1px solid ${color}`,
    borderRadius: 5,
    background: 'transparent',
    color: disabled ? '#C8B896' : color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'Crimson Pro', serif",
    fontSize: '0.82rem',
  }
}
