import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import VideoModal from '../components/VideoModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

const gallery = [
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80', alt: 'Elysium Exterior', span2: true },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80', alt: 'Living Room' },
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80', alt: 'Master Bedroom' },
  { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&q=80', alt: 'Pool' },
  { src: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=500&q=80', alt: 'Lobby' },
  { src: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500&q=80', alt: 'Kitchen' },
]

const floorPlans = [
  { emoji: '🏠', title: '3 BHK — Type A', sub: '2,100 sqft · Floors 5–20', price: '₹4.5 Cr onwards', gold: false },
  { emoji: '🏡', title: '3 BHK — Type B (Sea View)', sub: '2,800 sqft · Floors 21–35', price: '₹6.2 Cr onwards', gold: false },
  { emoji: '🏢', title: '4 BHK Premium', sub: '3,200 sqft · Floors 10–35', price: '₹8.5 Cr onwards', gold: false },
  { emoji: '✨', title: 'Sky Villa — Signature', sub: '4,500–8,000 sqft · Floors 38–42', price: '₹18 Cr onwards', gold: true },
]

const amenities = ['🏊 Infinity Pool', '🏋️ Equipped Gym', '🧘 Wellness Spa', '🎭 Grand Clubhouse', '🎬 Home Theatre', '🚗 Smart Parking', '🔒 24/7 Security', '🌿 Sky Garden', '🏪 Concierge']

const specs = [
  ['Structure', 'Earthquake-resistant RCC frame with premium Birla cement'],
  ['Flooring', 'Italian marble (Statuario) in living areas, engineered wood in bedrooms'],
  ['Kitchen', 'Modular kitchen with Corian countertops, Bosch appliances'],
  ['Bathroom', 'Kohler / Duravit sanitary ware, Grohe fittings, floor-to-ceiling tiles'],
  ['Windows', 'Double-glazed uPVC windows with 3-track sliding system'],
  ['Doors', 'Solid teak frame with BSL flush doors, high-security locks'],
  ['Electrical', 'Legrand modular switches, concealed wiring, 3-phase supply'],
  ['Smart Home', 'Fully integrated Lutron home automation system'],
]

const progress = [
  { label: 'Structure Work', pct: 100, text: '100%' },
  { label: 'External Cladding', pct: 100, text: '100%' },
  { label: 'Internal Finishes', pct: 95, text: '95%' },
  { label: 'Amenities & Landscaping', pct: 90, text: '90%' },
  { label: 'Possession Readiness', pct: 100, text: 'Ready' },
]

export default function ProjectDetail() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [enquiryDone, setEnquiryDone] = useState(false)
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  return (
    <>
      <Navbar />
      <PageHero title="Shivalaya" breadcrumb="Shivalaya" bgImage="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80" />

      {/* OVERVIEW BAR */}
      <div style={{ background: 'var(--navy)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
          {[['Location', 'Bandra West, Mumbai'], ['Configuration', '3 & 4 BHK + Sky Villa'], ['Price', '₹4.5 Cr onwards'], ['Status', 'Ready to Move', '#4CAF50'], ['RERA No.', 'P51800045678'], ['Total Units', '240 Units']].map(([label, val, color]) => (
            <div key={label} style={{ textAlign: 'center', color: 'var(--white)' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: color || 'var(--white)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="detail-layout">
            {/* MAIN */}
            <div>
              {/* GALLERY */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">Gallery</span>
                <h3 className="section-title">Project <span>Gallery</span></h3>
                <div className="gallery-grid">
                  {gallery.map((g, i) => (
                    <div key={i} className="gallery-item" style={g.span2 ? { gridColumn: 'span 2', aspectRatio: '16/7' } : {}}>
                      <img src={g.src} alt={g.alt} />
                      <div className="gallery-overlay"><i className="fas fa-expand-alt"></i></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ABOUT */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">About the Project</span>
                <h3 className="section-title">A New Definition of <span>Luxury Living</span></h3>
                <div className="gold-divider"></div>
                <p style={{ marginBottom: '1rem' }}>Shivalaya stands as the crowning jewel of Bandra West — a 42-storey residential masterpiece that redefines what luxury living means in Mumbai. Conceived by internationally acclaimed architect Farrukh Rahman and built with world-class materials, Elysium offers an unparalleled living experience where the Arabian Sea is your constant companion.</p>
                <p style={{ marginBottom: '1rem' }}>Each residence is a study in spatial intelligence and sensory elegance. Floor-to-ceiling glass allows natural light to cascade through open-plan living areas, while private terraces offer panoramic sea views.</p>
                <p>The sky villas on floors 38–42 represent the pinnacle of luxury — private elevators, plunge pools, home automation, and panoramic views on three sides make these among the most coveted addresses in India.</p>
              </div>

              {/* 3D WALKTHROUGH */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">Virtual Experience</span>
                <h3 className="section-title">3D <span>Walkthrough</span></h3>
                <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1.5px solid rgba(201,168,76,0.2)', position: 'relative' }} onClick={() => setVideoOpen(true)}>
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80" alt="3D Walkthrough" style={{ position: 'absolute', opacity: 0.15, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div className="play-btn" style={{ margin: '0 auto 1.5rem' }}><i className="fas fa-play"></i></div>
                    <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>Experience Elysium in 3D</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Click to launch virtual walkthrough</p>
                  </div>
                </div>
              </div>

              {/* FLOOR PLANS */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">Floor Plans</span>
                <h3 className="section-title">Choose Your <span>Configuration</span></h3>
                <div className="floor-plan-grid">
                  {floorPlans.map(fp => (
                    <div key={fp.title} className="floor-plan-card" style={fp.gold ? { borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.03)' } : {}}>
                      <div className="floor-plan-img" style={{ background: fp.gold ? 'linear-gradient(135deg,var(--navy),var(--navy-light))' : 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{fp.emoji}</div>
                      <div className="floor-plan-info">
                        <h5>{fp.title}</h5>
                        <p>{fp.sub}</p>
                        <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '0.5rem' }}>{fp.price}</p>
                        <button className={`btn ${fp.gold ? 'btn-gold' : 'btn-outline-gold'}`} style={{ marginTop: '0.8rem', padding: '0.4rem 1rem', fontSize: '0.7rem', width: '100%', justifyContent: 'center' }}>
                          {fp.gold ? 'Enquire Exclusively' : 'View Floor Plan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AMENITIES */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">World-Class Amenities</span>
                <h3 className="section-title">Every Detail, <span>Curated</span></h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                  {amenities.map(a => {
                    const [emoji, ...rest] = a.split(' ')
                    return (
                      <div key={a} style={{ padding: '1.2rem', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                        <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--navy)' }}>{rest.join(' ')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SPECIFICATIONS */}
              <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
                <span className="section-label">Specifications</span>
                <h3 className="section-title">Premium <span>Finishes</span></h3>
                <table className="spec-table">
                  <tbody>
                    {specs.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                  </tbody>
                </table>
              </div>

              {/* PROGRESS */}
              <div className="animate-on-scroll">
                <span className="section-label">Construction Update</span>
                <h3 className="section-title">Project <span>Progress</span></h3>
                <div style={{ marginTop: '1.5rem' }}>
                  {progress.map(p => (
                    <div key={p.label} className="progress-bar-wrap">
                      <div className="progress-label">{p.label}</div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.pct}%` }}></div></div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700 }}>{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STICKY SIDEBAR */}
            <div className="sticky-enquiry animate-on-scroll delay-3">
              <div style={{ background: 'var(--white)', border: '1.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--navy)', marginBottom: '0.3rem' }}>Request Information</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>Get price, floor plans &amp; brochure</p>
                </div>
                {!enquiryDone ? (
                  <form onSubmit={e => { e.preventDefault(); setEnquiryDone(true) }}>
                    <div className="form-group"><label className="form-label">Name *</label><input type="text" className="form-control" placeholder="Your name" required /></div>
                    <div className="form-group"><label className="form-label">Phone *</label><input type="tel" className="form-control" placeholder="+91 98765 43210" required /></div>
                    <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" placeholder="your@email.com" /></div>
                    <div className="form-group"><label className="form-label">I'm interested in</label>
                      <select className="form-control"><option>3 BHK (₹4.5 Cr+)</option><option>4 BHK Premium (₹8.5 Cr+)</option><option>Sky Villa (₹18 Cr+)</option></select>
                    </div>
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}><i className="fas fa-paper-plane"></i> Submit Enquiry</button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '0.8rem' }}><i className="fas fa-check-circle"></i></div>
                    <h5 style={{ color: 'var(--navy)' }}>Enquiry Received!</h5>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>Our advisor will call you within 2 hours.</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button className="btn btn-navy" style={{ justifyContent: 'center' }} onClick={() => setBookingOpen(true)}><i className="fas fa-calendar-check"></i> Book Site Visit</button>
                <a href="#" className="btn btn-outline-gold" style={{ justifyContent: 'center', textAlign: 'center' }}><i className="fas fa-file-pdf"></i> Download Brochure</a>
                <a href="https://wa.me/918001234567?text=I'm%20interested%20in%20Omkara%20Elysium" target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: '#fff', justifyContent: 'center' }}><i className="fab fa-whatsapp"></i> WhatsApp Us</a>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'var(--off-white)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--gold)' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--navy)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RERA Registered</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-dark)' }}>Reg. No.: <strong>P51800045678</strong></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.3rem' }}>MahaRERA | Valid till Dec 2025</p>
                <Link to="/rera" style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600 }}>View RERA Details →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <Chatbot onOpenBooking={() => setBookingOpen(true)} />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  )
}
