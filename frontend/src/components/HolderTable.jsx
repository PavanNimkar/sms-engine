// src/components/HolderTable.jsx
// धारकांची यादी — तक्ता

import HolderRow from './HolderRow'

export default function HolderTable({ holders, loading, onEdit, onDelete, deleting }) {
  const thStyle = {
    padding: '0.7rem 0.9rem',
    textAlign: 'left',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#7A5030',
    background: '#F0E4CC',
    fontFamily: "'Crimson Pro', serif",
    borderBottom: '2px solid #D4B896',
    whiteSpace: 'nowrap',
  }

  if (loading) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem', color: '#A89070',
        fontFamily: "'Crimson Pro', serif",
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #E8D9C0', borderTop: '3px solid #E8681A',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        लोड होत आहे…
      </div>
    )
  }

  if (!holders.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem', color: '#A89070',
        background: '#FFFDF8', borderRadius: 10, border: '1px dashed #D4B896',
        fontFamily: "'Crimson Pro', serif",
      }}>
        कोणताही धारक सापडला नाही.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #E8D9C0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: 80 }}>अनु. नंबर</th>
            <th style={thStyle}>मिळकत धारकाचे नाव</th>
            <th style={{ ...thStyle, width: 150 }}>फोन नंबर</th>
            <th style={{ ...thStyle, width: 160 }}>क्रिया</th>
          </tr>
        </thead>
        <tbody>
          {holders.map(h => (
            <HolderRow
              key={h.id}
              holder={h}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deleting}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
