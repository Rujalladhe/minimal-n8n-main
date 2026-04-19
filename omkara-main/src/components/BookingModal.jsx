import { useState } from 'react'

export default function BookingModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [visitType, setVisitType] = useState('physical')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setVisitType('physical')
    onClose()
  }

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h3>Book a Site Visit</h3>
            <p>Our expert will arrange your preferred experience</p>
          </div>
          <button className="modal-close" onClick={handleClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input type="tel" className="form-control" placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-control" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Project</label>
                <select className="form-control">
                  <option value="">Select a project</option>
                  <option>Shivalaya</option>
                  <option>Villa doria</option>
                  <option>Omkara Greens</option>
                  <option>Omkara Pinnacle</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <select className="form-control" required>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>3:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="visit-type-selector">
                <div className={`visit-type-option${visitType === 'physical' ? ' selected' : ''}`} onClick={() => setVisitType('physical')}>
                  <div className="visit-type-icon">🏢</div>
                  <h5>Physical Visit</h5>
                  <p>Visit our site</p>
                </div>
                <div className={`visit-type-option${visitType === 'virtual' ? ' selected' : ''}`} onClick={() => setVisitType('virtual')}>
                  <div className="visit-type-icon">🎥</div>
                  <h5>Virtual Call</h5>
                  <p>Video walkthrough</p>
                </div>
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                <i className="fas fa-calendar-check"></i> Confirm Booking
              </button>
            </form>
          ) : (
            <div className="confirmation-box" style={{ display: 'block' }}>
              <div className="check-icon"><i className="fas fa-check"></i></div>
              <h3>Booking Confirmed!</h3>
              <p>Our team will contact you within 2 hours.</p>
              <button className="btn btn-gold" style={{ marginTop: '1.5rem' }} onClick={handleClose}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
