import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'
import useCounter from '../components/useCounter'

const timeline = [
  { year: '2001', title: 'Foundation', desc: 'Omkara Group Estate founded in Mumbai. First project — a 50-unit boutique residential complex in Andheri.', left: true },
  { year: '2006', title: 'Expansion to Bengaluru', desc: "Launched first South India project. Awarded 'Most Promising Developer' by CREDAI.", left: false },
  { year: '2010', title: '5,000 Homes Milestone', desc: 'Delivered our 5,000th home. Launched first integrated township — Omkara Greens Phase 1.', left: true },
  { year: '2015', title: 'Commercial Foray', desc: 'Entered Grade-A commercial segment with Villa doria BKC. Won Best Commercial Project award.', left: false },
  { year: '2018', title: 'Green Building Pioneer', desc: 'First developer in India to achieve IGBC Platinum ratings across all projects. 50,000+ trees planted.', left: true },
  { year: '2022', title: 'IPO & National Recognition', desc: 'Successfully listed on NSE. Recognized as India\'s Top 5 Real Estate Developers by Business Today.', left: false },
  { year: '2025', title: '₹3,100 Cr Revenue', desc: 'Achieved record revenue with 18,500+ homes delivered. Present across 12 cities. 42 landmark projects completed.', left: true },
]

export default function About() {
  const [bookingOpen, setBookingOpen] = useState(false)
  useScrollAnimation()
  useCounter()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  return (
    <>
      <Navbar />
      <PageHero title="Our Legacy" breadcrumb="About Us" bgImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80" />

      {/* MISSION & VISION */}
      <section className="section-pad">
        <div className="container">
          <div className="about-grid">
            <div className="animate-on-scroll">
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">Crafting Iconic <span>Landmarks</span> for Over Two Decades</h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '1.2rem' }}>Founded in 2001 by visionary industrialist Shri Vikram Anand, Omkara Group Estate began with a single conviction: that great architecture has the power to transform lives, shape communities, and define the future of cities.</p>
              <p style={{ marginBottom: '1.2rem' }}>Over 25 years, this conviction has led us to deliver 42 landmark projects across Mumbai, Bengaluru, Hyderabad, Gurugram, and Pune — encompassing ultra-luxury residences, Grade-A commercial spaces, integrated townships, and mixed-use destinations.</p>
              <p>Today, Omkara is synonymous with timeless design, meticulous precision, and an unwavering promise to our homeowners — a promise built on 18,500+ delivered homes and 98% customer satisfaction.</p>
            </div>
            <div className="animate-on-scroll delay-2">
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ background: 'var(--navy)', padding: '2.5rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '3rem', opacity: 0.08, color: 'var(--gold)' }}><i className="fas fa-eye"></i></div>
                  <span className="section-label">Our Vision</span>
                  <h3 style={{ color: 'var(--white)', fontSize: '1.4rem', marginBottom: '1rem' }}>To be India's most admired real estate brand, setting global benchmarks in luxury living.</h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)' }}>We envision a future where every Omkara community becomes a vibrant hub of prosperity, sustainability, and extraordinary life experiences.</p>
                </div>
                <div style={{ background: 'var(--gold)', padding: '2.5rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '3rem', opacity: 0.15, color: 'var(--white)' }}><i className="fas fa-bullseye"></i></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.8rem' }}>Our Mission</span>
                  <h3 style={{ color: 'var(--white)', fontSize: '1.4rem', marginBottom: '1rem' }}>To deliver spaces that transcend the ordinary — where architecture meets aspiration.</h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)' }}>Through relentless innovation, ethical practices, and customer-centric values, we create landmark developments that stand the test of time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section-pad bg-off-white">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Our Pillars</span>
            <h2 className="section-title">Values that Define <span>Excellence</span></h2>
            <div className="gold-divider center"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', marginTop: '3rem' }} className="values-grid">
            {[{ icon: 'fa-gem', title: 'Excellence', desc: 'We set the highest standards and never compromise on quality in design, construction, or customer service.' }, { icon: 'fa-handshake', title: 'Integrity', desc: 'Complete transparency, full RERA compliance, and zero hidden costs — our word is our bond.', d: 'delay-1' }, { icon: 'fa-lightbulb', title: 'Innovation', desc: "From smart home automation to green construction technologies, we lead India's real estate future.", d: 'delay-2' }, { icon: 'fa-leaf', title: 'Sustainability', desc: 'Every Omkara project is designed to minimize environmental impact while maximizing resident wellbeing.', d: 'delay-3' }].map(v => (
              <div key={v.title} className={`card animate-on-scroll ${v.d || ''} text-center`}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg,var(--gold),var(--gold-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: '1.4rem', color: 'var(--white)' }}><i className={`fas ${v.icon}`}></i></div>
                <h4 style={{ marginBottom: '0.7rem' }}>{v.title}</h4>
                <p style={{ fontSize: '0.85rem' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div className="stats-grid">
            {[{ count: 25, label: 'Years of Legacy', d: '' }, { count: 42, label: 'Projects Completed', d: 'delay-1' }, { count: 18500, label: 'Homes Delivered', d: 'delay-2' }, { count: 5000, label: 'Employees Across India', d: 'delay-3' }].map(s => (
              <div key={s.label} className={`stat-item animate-on-scroll ${s.d}`}>
                <div className="stat-num" data-count={s.count}>0</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Architects of <span>Visionary Growth</span></h2>
            <div className="gold-divider center"></div>
            <p style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>Guided by seasoned industry leaders who combine decades of expertise with forward-thinking vision.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem' }} className="leadership-grid">
            {[{ img: 'https://randomuser.me/api/portraits/men/75.jpg', name: 'Vikram Anand', role: 'Chairman & Managing Director', bio: 'Visionary entrepreneur with 30+ years of experience in real estate, infrastructure, and urban development. Under his leadership, Omkara has become one of India\'s most prestigious developers.', d: '' }, { img: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Roshni Anand', role: 'Executive Director', bio: "An architect by training and entrepreneur by passion, Roshni leads Omkara's design philosophy, customer experience, and sustainability initiatives.", d: 'delay-1' }, { img: 'https://randomuser.me/api/portraits/men/42.jpg', name: 'Arjun Kapoor', role: 'Chief Executive Officer', bio: "A Harvard Business School alumnus, Arjun drives Omkara's expansion strategy, investor relations, and digital transformation with a sharp focus on sustainable growth.", d: 'delay-2' }].map(l => (
              <div key={l.name} className={`animate-on-scroll ${l.d} text-center`}>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <img src={l.img} alt={l.name} style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--gold)', boxShadow: '0 8px 30px rgba(201,168,76,0.25)' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 'calc(50% - 80px + 10px)', width: '34px', height: '34px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-linkedin-in" style={{ color: 'var(--white)', fontSize: '0.9rem' }}></i></div>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{l.name}</h3>
                <p style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>{l.role}</p>
                <p style={{ fontSize: '0.85rem' }}>{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-pad bg-off-white">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Our Journey</span>
            <h2 className="section-title">Milestones of <span>Excellence</span></h2>
            <div className="gold-divider center"></div>
          </div>
          <div className="timeline" style={{ marginTop: '4rem' }}>
            {timeline.map((t, i) => (
              <div key={t.year} className="timeline-item animate-on-scroll">
                {t.left ? (
                  <>
                    <div className="timeline-content"><div className="timeline-year">{t.year}</div><h4>{t.title}</h4><p>{t.desc}</p></div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content"></div>
                  </>
                ) : (
                  <>
                    <div className="timeline-content"></div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content"><div className="timeline-year">{t.year}</div><h4>{t.title}</h4><p>{t.desc}</p></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '3rem' }}>
            <span className="section-label">Recognition</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Awards &amp; <span>Accolades</span></h2>
            <div className="gold-divider center"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {[{ icon: 'fa-trophy', title: 'Best Luxury Developer', sub: 'ET Real Estate Awards 2024', d: '' }, { icon: 'fa-medal', title: 'Green Builder of the Year', sub: 'CREDAI India 2023', d: 'delay-1' }, { icon: 'fa-star', title: 'Top 5 Real Estate Cos.', sub: 'Business Today 2022', d: 'delay-2' }, { icon: 'fa-award', title: 'Best Customer Experience', sub: 'NHB Awards 2021', d: 'delay-3' }].map(a => (
              <div key={a.title} className={`animate-on-scroll ${a.d} text-center`} style={{ padding: '2rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '1rem' }}><i className={`fas ${a.icon}`}></i></div>
                <h5 style={{ color: 'var(--white)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{a.title}</h5>
                <p style={{ fontSize: '0.78rem' }}>{a.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80')", backgroundSize: 'cover' }}></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to <span style={{ color: 'var(--gold)' }}>Begin Your Journey?</span></h2>
            <p>Explore our curated portfolio and find your perfect Omkara home.</p>
            <div className="cta-actions">
              <Link to="/projects" className="btn btn-gold"><i className="fas fa-building"></i> Explore Projects</Link>
              <button className="btn btn-outline-white" onClick={() => setBookingOpen(true)}><i className="fas fa-calendar"></i> Book Site Visit</button>
            </div>
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
