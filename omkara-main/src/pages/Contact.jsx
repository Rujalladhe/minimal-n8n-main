import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

export default function Contact() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [formDone, setFormDone] = useState(false)
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  return (
    <>
      <Navbar />
      <PageHero title="Contact Us" breadcrumb="Contact" bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" />

      <section className="section-pad">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '5rem', alignItems: 'start' }}>
            {/* INFO */}
            <div className="animate-on-scroll">
              <span className="section-label">Get in Touch</span>
              <h2 className="section-title">Let's Start Your <span>Journey</span></h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '3rem' }}>Our expert advisors are ready to guide you through our portfolio and help you find the perfect property or investment opportunity.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                {[{ icon: 'fa-map-marker-alt', title: 'Corporate Office', lines: ['Omkara House, 12th Floor, Bandra-Kurla Complex', 'Mumbai — 400051, Maharashtra, India'], bg: 'linear-gradient(135deg,var(--gold),var(--gold-dark))' }, { icon: 'fa-phone', title: 'Sales Helpline', lines: ['+91 800 123 4567 (Toll Free)', 'Mon–Sat: 9AM–7PM IST'], bg: 'linear-gradient(135deg,var(--gold),var(--gold-dark))' }, { icon: 'fa-envelope', title: 'Email Us', lines: ['sales@omkaragroup.com', 'Response within 4 hours'], bg: 'linear-gradient(135deg,var(--gold),var(--gold-dark))' }].map(c => (
                  <div key={c.title} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '52px', height: '52px', background: c.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '1.1rem', flexShrink: 0 }}><i className={`fas ${c.icon}`}></i></div>
                    <div>
                      <h5 style={{ color: 'var(--navy)', marginBottom: '0.3rem', fontSize: '1rem' }}>{c.title}</h5>
                      {c.lines.map((l, i) => <p key={i} style={{ fontSize: i === 1 ? '0.82rem' : '0.88rem', color: i === 1 ? 'var(--gray)' : 'var(--navy)' }}>{l}</p>)}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '52px', height: '52px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', fontSize: '1.1rem', flexShrink: 0 }}><i className="fab fa-whatsapp"></i></div>
                  <div>
                    <h5 style={{ color: 'var(--navy)', marginBottom: '0.3rem', fontSize: '1rem' }}>WhatsApp</h5>
                    <p style={{ fontSize: '0.88rem' }}><a href="https://wa.me/918001234567" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>Chat with Us Now</a></p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>Instant response guaranteed</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '3rem' }}>
                <h4 style={{ marginBottom: '1.5rem', color: 'var(--navy)' }}>Sales Offices</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[['Mumbai', 'BKC · Bandra · Juhu'], ['Bengaluru', 'Whitefield · Koramangala'], ['Hyderabad', 'Financial District · Jubilee Hills'], ['Gurugram', 'Cybercity · Golf Course Road']].map(([city, sub]) => (
                    <div key={city} style={{ padding: '1rem 1.2rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)', width: '16px' }}></i>
                      <div><div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{city}</div><div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{sub}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="animate-on-scroll delay-2">
              <div style={{ background: 'var(--off-white)', padding: '3rem', borderRadius: '16px', border: '1.5px solid rgba(201,168,76,0.15)' }}>
                <h3 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>Send Us a Message</h3>
                <p style={{ marginBottom: '2rem', fontSize: '0.88rem' }}>Our property advisor will respond within 4 hours during business hours.</p>
                {!formDone ? (
                  <form onSubmit={e => { e.preventDefault(); setFormDone(true) }}>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-control" placeholder="Your full name" required /></div>
                      <div className="form-group"><label className="form-label">Phone *</label><input type="tel" className="form-control" placeholder="+91 98765 43210" required /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" placeholder="your@email.com" required /></div>
                    <div className="form-row">
                      <div className="form-group"><label className="form-label">I'm Looking For</label><select className="form-control"><option>Residential Property</option><option>Commercial Property</option><option>Luxury Villa</option><option>Investment</option><option>General Enquiry</option></select></div>
                      <div className="form-group"><label className="form-label">Preferred City</label><select className="form-control"><option>Mumbai</option><option>Bengaluru</option><option>Hyderabad</option><option>Gurugram</option><option>Pune</option><option>Chennai</option></select></div>
                    </div>
                    <div className="form-group"><label className="form-label">Budget Range</label><select className="form-control"><option>₹50L – ₹1 Cr</option><option>₹1 Cr – ₹2 Cr</option><option>₹2 Cr – ₹5 Cr</option><option>₹5 Cr – ₹10 Cr</option><option>₹10 Cr+</option></select></div>
                    <div className="form-group"><label className="form-label">Message</label><textarea className="form-control" rows="4" placeholder="Tell us more about what you're looking for..."></textarea></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                      <input type="checkbox" id="consent" required style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      <label htmlFor="consent" style={{ fontSize: '0.78rem', color: 'var(--gray-dark)' }}>I consent to Omkara Group contacting me with relevant property information.</label>
                    </div>
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}><i className="fas fa-paper-plane"></i> Send Message</button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '1rem' }}><i className="fas fa-check-circle"></i></div>
                    <h3 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                    <p>Thank you! Our property advisor will contact you within <strong>4 hours</strong>.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <div className="map-container animate-on-scroll">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3889959065267!2d72.85720431490224!3d19.065478787086984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e1b7b7b7b7%3A0x7b7b7b7b7b7b7b7b!2sBandra%20Kurla%20Complex%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Omkara Group Mumbai Office"></iframe>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <Chatbot onOpenBooking={() => setBookingOpen(true)} />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  )
}
