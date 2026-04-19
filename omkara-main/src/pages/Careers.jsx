import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

const jobs = [
  { dept: 'sales', title: 'Senior Relationship Manager — Luxury Residential', location: 'Mumbai', exp: '5–8 Years', salary: '₹18–28 LPA' },
  { dept: 'engineering', title: 'Project Manager — Civil Engineering', location: 'Bengaluru', exp: '8–12 Years', salary: '₹25–40 LPA' },
  { dept: 'design', title: 'Principal Architect — Luxury Residential', location: 'Mumbai', exp: '10–15 Years', salary: '₹35–55 LPA' },
  { dept: 'marketing', title: 'Head of Digital Marketing & Lead Generation', location: 'Mumbai', exp: '7–10 Years', salary: '₹30–45 LPA' },
  { dept: 'operations', title: 'Facilities Manager — Luxury Residential', location: 'Hyderabad', exp: '5–8 Years', salary: '₹15–22 LPA' },
  { dept: 'sales', title: 'NRI Sales Manager — International Markets', location: 'Mumbai / Remote', exp: '6–10 Years', salary: '₹28–40 LPA' },
  { dept: 'engineering', title: 'MEP Engineer — Smart Building Technology', location: 'Gurugram', exp: '4–7 Years', salary: '₹18–28 LPA' },
  { dept: 'design', title: 'Interior Designer — Luxury Show Homes', location: 'Mumbai', exp: '4–8 Years', salary: '₹18–30 LPA' },
]

export default function Careers() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [applyModal, setApplyModal] = useState(null)
  const [applyDone, setApplyDone] = useState(false)
  const [deptFilter, setDeptFilter] = useState('all')
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  const filtered = deptFilter === 'all' ? jobs : jobs.filter(j => j.dept === deptFilter)

  return (
    <>
      <Navbar />
      <PageHero title="Build Your Career" breadcrumb="Careers" bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80" />

      {/* WHY JOIN */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="animate-on-scroll">
              <span className="section-label">Life at Omkara</span>
              <h2 className="section-title">Shape India's <span>Most Iconic</span> Skylines</h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '1.2rem' }}>At Omkara Group Estate, you won't just build buildings — you'll create communities, shape cities, and leave a lasting legacy. We are a team of 5,000+ professionals united by a passion for excellence.</p>
              <p style={{ marginBottom: '2rem' }}>We offer an environment where ambition is celebrated, innovation is rewarded, and talent is nurtured.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['5,000+', 'Team Members'], ['12', 'Office Locations'], ['94%', 'Employee Satisfaction'], ['₹32 Lac', 'Avg. Fresher Package']].map(([num, label]) => (
                  <div key={label} style={{ padding: '1.2rem', background: 'var(--off-white)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--gold)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-primary)' }}>{num}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-on-scroll delay-2">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80" alt="Careers" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-dark)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '3rem' }}>
            <span className="section-label">Employee Benefits</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Why Professionals <span>Choose Omkara</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {[{ icon: 'fa-chart-line', title: 'Growth Trajectory', desc: 'Clear career paths, annual promotions, and leadership development programs', d: '' }, { icon: 'fa-rupee-sign', title: 'Competitive Pay', desc: 'Top-quartile compensation with performance bonuses and ESOPs', d: 'delay-1' }, { icon: 'fa-heartbeat', title: 'Health & Wellness', desc: 'Comprehensive medical coverage for employees and their families', d: 'delay-2' }, { icon: 'fa-graduation-cap', title: 'Learning & Development', desc: 'Annual learning budget, MBA sponsorships, and global exposure programs', d: 'delay-3' }].map(b => (
              <div key={b.title} className={`animate-on-scroll ${b.d} text-center`} style={{ padding: '2rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}><i className={`fas ${b.icon}`}></i></div>
                <h5 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{b.title}</h5>
                <p style={{ fontSize: '0.82rem' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOB OPENINGS */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '3rem' }}>
            <span className="section-label">Open Positions</span>
            <h2 className="section-title">Current <span>Openings</span></h2>
            <div className="gold-divider center"></div>
          </div>
          <div className="projects-filter animate-on-scroll" style={{ marginBottom: '2rem' }}>
            {['all', 'sales', 'engineering', 'design', 'marketing', 'operations'].map(f => (
              <button key={f} className={`filter-btn${deptFilter === f ? ' active' : ''}`} onClick={() => setDeptFilter(f)}>
                {f === 'all' ? 'All Departments' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div id="jobsList">
            {filtered.map((j, i) => (
              <div key={i} className={`job-card animate-on-scroll ${i % 3 === 1 ? 'delay-1' : i % 3 === 2 ? 'delay-2' : ''}`} data-dept={j.dept}>
                <div className="job-dept">{j.dept.charAt(0).toUpperCase() + j.dept.slice(1)}</div>
                <div className="job-info">
                  <h4>{j.title}</h4>
                  <div className="job-meta">
                    <span><i className="fas fa-map-marker-alt"></i> {j.location}</span>
                    <span><i className="fas fa-briefcase"></i> {j.exp}</span>
                    <span><i className="fas fa-rupee-sign"></i> {j.salary}</span>
                  </div>
                </div>
                <button className="btn btn-outline-gold" onClick={() => { setApplyModal(j.title); setApplyDone(false) }}>Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY MODAL */}
      {applyModal && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setApplyModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div><h3>Apply for Position</h3><p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.3rem' }}>{applyModal}</p></div>
              <button className="modal-close" onClick={() => setApplyModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              {!applyDone ? (
                <form onSubmit={e => { e.preventDefault(); setApplyDone(true) }}>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-control" required /></div>
                    <div className="form-group"><label className="form-label">Phone *</label><input type="tel" className="form-control" required /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" required /></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Total Experience</label><select className="form-control"><option>0–2 Years</option><option>2–5 Years</option><option>5–10 Years</option><option>10+ Years</option></select></div>
                    <div className="form-group"><label className="form-label">Current CTC (LPA)</label><input type="text" className="form-control" placeholder="e.g., 15 LPA" /></div>
                  </div>
                  <div className="form-group"><label className="form-label">LinkedIn Profile</label><input type="url" className="form-control" placeholder="https://linkedin.com/in/yourname" /></div>
                  <div className="form-group"><label className="form-label">Cover Letter</label><textarea className="form-control" rows="4" placeholder="Tell us why you're the perfect fit for Omkara..."></textarea></div>
                  <div className="form-group"><label className="form-label">Upload Resume (PDF/DOC)</label><input type="file" className="form-control" accept=".pdf,.doc,.docx" /></div>
                  <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}><i className="fas fa-paper-plane"></i> Submit Application</button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '1rem' }}><i className="fas fa-check-circle"></i></div>
                  <h3 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>Application Submitted!</h3>
                  <p>Our HR team will review your application and reach out within 5 business days.</p>
                  <button className="btn btn-gold" style={{ marginTop: '1.5rem' }} onClick={() => setApplyModal(null)}>Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsApp />
      <Chatbot onOpenBooking={() => setBookingOpen(true)} />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  )
}
