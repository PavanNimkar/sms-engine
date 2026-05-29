// src/components/DeleteConfirmModal.jsx
// हटवण्याची पुष्टी करण्यासाठी डायलॉग

export default function DeleteConfirmModal({ holder, onConfirm, onCancel, deleting }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,18,8,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1100, padding: '1rem',
      }}
    >
      <div style={{
        background: '#FBF5E8', borderRadius: 12, width: '100%', maxWidth: 380,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        fontFamily: "'Crimson Pro', serif", overflow: 'hidden',
      }}>
        <div style={{ padding: '1.4rem' }}>
          <h3 style={{ margin: '0 0 0.6rem', color: '#3A2A1A', fontSize: '1.1rem' }}>
            धारक हटवायचा?
          </h3>
          <p style={{ margin: 0, color: '#6A5040', fontSize: '0.95rem', lineHeight: 1.5 }}>
            <strong>{holder.holder_name}</strong> (अनु. {holder.serial_number}) हा धारक
            कायमचा हटवला जाईल. ही क्रिया परत घेता येणार नाही.
          </p>
        </div>
        <div style={{
          padding: '0.9rem 1.4rem', borderTop: '1px solid #E8D9C0',
          display: 'flex', gap: '0.7rem', justifyContent: 'flex-end',
        }}>
          <button onClick={onCancel} style={{
            padding: '0.5rem 1.1rem', border: '1.5px solid #C8B896',
            borderRadius: 6, background: 'transparent', color: '#7A6040',
            cursor: 'pointer', fontFamily: "'Crimson Pro', serif", fontSize: '1rem',
          }}>रद्द करा</button>
          <button onClick={onConfirm} disabled={deleting} style={{
            padding: '0.5rem 1.2rem', border: 'none', borderRadius: 6,
            background: deleting ? '#C8B896' : '#dc2626',
            color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer',
            fontFamily: "'Crimson Pro', serif", fontSize: '1rem', fontWeight: 700,
          }}>
            {deleting ? 'हटवत आहे…' : 'हो, हटवा'}
          </button>
        </div>
      </div>
    </div>
  )
}
