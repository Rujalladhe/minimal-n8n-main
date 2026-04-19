export default function VideoModal({ isOpen, onClose }) {
  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div style={{ maxWidth: '800px', width: '100%', background: 'var(--navy)', borderRadius: '12px', padding: '3rem', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '4rem', color: 'var(--gold)', marginBottom: '1rem' }}><i className="fas fa-vr-cardboard"></i></div>
        <h3 style={{ color: 'var(--white)', marginBottom: '1rem' }}>3D Virtual Walkthrough</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
          Experience Shivalaya in stunning photorealistic 3D. Our immersive virtual tour lets you explore every room, material, and view before possession.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3rem', border: '1px solid rgba(201,168,76,0.2)', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>Virtual tour loading... Please ensure a stable internet connection for the best experience.</p>
        </div>
        <button className="btn btn-gold" onClick={onClose}><i className="fas fa-times"></i> Close</button>
      </div>
    </div>
  )
}
