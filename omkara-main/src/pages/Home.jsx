import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookingModal from '../components/BookingModal'
import VideoModal from '../components/VideoModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'
import useCounter from '../components/useCounter'

const projects = [
  { id: 1, category: 'residential', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', badge: 'Ready to Move', badgeBg: '', name: 'Shivalaya', location: 'Bandra West, Mumbai', desc: 'Ultra-luxury 3 & 4 BHK residences with panoramic sea views, private terraces and world-class amenities.', price: '₹4.5 Cr', delay: '' },
  { id: 2, category: 'commercial', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', badge: 'New Launch', badgeBg: 'var(--navy)', name: 'Villa doria', location: 'BKC, Mumbai', desc: 'Grade-A commercial offices and retail spaces in the heart of Bandra-Kurla Complex with LEED certification.', price: '₹2.2 Cr', delay: 'delay-1' },]

const amenities = [
  { icon: '🏊', label: 'Infinity Pool', delay: '' }, { icon: '🏋️', label: 'Premium Gym', delay: 'delay-1' },
  { icon: '🧘', label: 'Wellness Spa', delay: 'delay-2' }, { icon: '🎭', label: 'Clubhouse', delay: 'delay-3' },
  { icon: '🌳', label: 'Landscaped Parks', delay: 'delay-4' }, { icon: '🚗', label: 'Smart Parking', delay: 'delay-5' },
  { icon: '🔒', label: '24/7 Security', delay: '' }, { icon: '🎾', label: 'Sports Courts', delay: 'delay-1' },
  { icon: '👶', label: "Kids' Zone", delay: 'delay-2' }, { icon: '🎬', label: 'Home Theatre', delay: 'delay-3' },
  { icon: '🌿', label: 'Rooftop Garden', delay: 'delay-4' }, { icon: '🔋', label: 'EV Charging', delay: 'delay-5' },
]

const testimonials = [
  { quote: 'Investing in Shivalaya was the best financial decision of my life. The craftsmanship is extraordinary — every corner reflects thought and precision. It\'s not just a home; it\'s a statement.', name: 'Rajesh Mehta', role: 'MD, Infra Ventures · Bandra West Resident', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { quote: 'The transparency and professionalism of the Omkara team was refreshing. RERA compliance, timely updates, zero hidden costs — they delivered exactly as promised. Our villa exceeded expectations.', name: 'Priya Sharma', role: 'CEO, Aura Consulting · Whitefield Resident', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { quote: 'As an NRI investor, trust is paramount. Omkara\'s reputation, documentation, and post-possession support gave me complete confidence. The rental yield on my Villa doria commercial unit is exceptional.', name: 'Arun Nair', role: 'NRI Investor · Dubai', img: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { quote: 'The amenities at Omkara Greens are unparalleled. The infinity pool, landscaped gardens, and clubhouse — it truly feels like a five-star resort every single day. My family is absolutely in love.', name: 'Ananya Krishnan', role: 'Architect · Bengaluru Resident', img: 'https://randomuser.me/api/portraits/women/28.jpg' },
]

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [testiIndex, setTestiIndex] = useState(0)
  const trackRef = useRef(null)

  useScrollAnimation()
  useCounter()

  // expose booking modal globally for Navbar
  useEffect(() => {
    window.openBookingModal = () => setBookingOpen(true)
    return () => { delete window.openBookingModal }
  }, [])

  // parallax hero
  useEffect(() => {
    const heroBg = document.querySelector('.hero-bg-img')
    const onScroll = () => { if (heroBg) heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)` }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // testimonials auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setTestiIndex(i => {
        const visible = window.innerWidth <= 650 ? 1 : window.innerWidth <= 900 ? 2 : 3
        return i >= testimonials.length - visible ? 0 : i + 1
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!trackRef.current) return
    const visible = window.innerWidth <= 650 ? 1 : window.innerWidth <= 900 ? 2 : 3
    const cardWidth = trackRef.current.parentElement.offsetWidth / visible
    trackRef.current.style.transform = `translateX(-${testiIndex * (cardWidth + 16)}px)`
  }, [testiIndex])

  const moveTestimonials = (dir) => {
    setTestiIndex(i => {
      const visible = window.innerWidth <= 650 ? 1 : window.innerWidth <= 900 ? 2 : 3
      const max = testimonials.length - visible
      return Math.max(0, Math.min(i + dir, max))
    })
  }

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter)

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-bg-img"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">Since 2001 · Premium Real Estate</span>
            <h1>Building <span>Landmarks.</span><br />Creating Legacies.</h1>
            <p className="hero-desc">India's most trusted luxury real estate developer, crafting iconic residences and commercial spaces that redefine modern urban living.</p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-gold"><i className="fas fa-building"></i> Explore Projects</Link>
              <button className="btn btn-outline-white" onClick={() => setBookingOpen(true)}><i className="fas fa-calendar-check"></i> Book Site Visit</button>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="hero-stat-num" data-count="25">0</span>+<span className="hero-stat-label">Years Legacy</span></div>
          <div className="hero-stat"><span className="hero-stat-num" data-count="18500">0</span>+<span className="hero-stat-label">Homes Delivered</span></div>
          <div className="hero-stat"><span className="hero-stat-num" data-count="42">0</span><span className="hero-stat-label">Landmark Projects</span></div>
          <div className="hero-stat"><span className="hero-stat-num" data-count="12">0</span><span className="hero-stat-label">Cities Presence</span></div>
        </div>
        <div className="hero-scroll-indicator"><div className="scroll-line"></div>Scroll</div>
      </section>

      {/* ABOUT */}
      <section className="section-pad" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual animate-on-scroll">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" alt="Omkara Group Signature Tower" className="about-img" />
              <div className="about-badge"><div className="about-badge-num">25+</div><div className="about-badge-text">Years of<br />Excellence</div></div>
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" alt="Premium Interior" className="about-img-accent" />
            </div>
            <div className="about-text animate-on-scroll delay-2">
              <span className="section-label">Our Legacy</span>
              <h2 className="section-title">Crafting Iconic <span>Landmarks</span> Since 2001</h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '1.2rem' }}>At Omkara Group Estate, we transcend conventional real estate development. We are architects of environments that inspire, communities that thrive, and legacies that endure.</p>
              <p style={{ marginBottom: '2rem' }}>From Mumbai's skyline to Bengaluru's tech corridors, every Omkara project is a testament to meticulous planning, premium craftsmanship, and an unwavering commitment to delivering exceptional value.</p>
              <div className="about-pillars">
                {[{ icon: 'fa-gem', title: 'Premium Quality', desc: 'Uncompromising standards in materials and construction' }, { icon: 'fa-clock', title: 'Timely Delivery', desc: '100% on-time project completion track record' }, { icon: 'fa-leaf', title: 'Sustainability', desc: 'Eco-conscious design for a greener tomorrow' }, { icon: 'fa-map-marker-alt', title: 'Prime Locations', desc: 'Strategic addresses with highest appreciation value' }].map(p => (
                  <div className="about-pillar" key={p.title}>
                    <div className="about-pillar-icon"><i className={`fas ${p.icon}`}></i></div>
                    <h5>{p.title}</h5>
                    <p>{p.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/about" className="btn btn-navy"><i className="fas fa-arrow-right"></i> Discover Our Story</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy section-pad-sm">
        <div className="container">
          <div className="stats-grid">
            {[{ count: 42, label: 'Landmark Projects', d: '' }, { count: 18500, label: 'Homes Delivered', d: 'delay-1' }, { count: 35, label: 'Mn. Sq. Ft. Developed', d: 'delay-2' }, { count: 98, label: '% Customer Satisfaction', d: 'delay-3' }].map(s => (
              <div className={`stat-item animate-on-scroll ${s.d}`} key={s.label}>
                <div className="stat-num" data-count={s.count}>0</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section-pad bg-off-white" id="projects">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Our Portfolio</span>
            <h2 className="section-title">Featured <span>Projects</span></h2>
            <div className="gold-divider center"></div>
            <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>Each Omkara project is conceived as a landmark — a place that will shape its community for generations.</p>
          </div>
          <div className="projects-filter animate-on-scroll">
            {['all', 'residential', 'commercial', 'township', 'upcoming'].map(f => (
              <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
                {f === 'all' ? 'All Projects' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="projects-grid" id="projectsGrid">
            {filtered.map(p => (
              <div key={p.id} className={`project-card animate-on-scroll ${p.delay}`} data-category={p.category} onClick={() => !p.registerInterest && (window.location.href = '/project-detail')}>
                <div style={{ overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.name} className="project-card-img" />
                  <span className="project-card-badge" style={p.badgeBg ? { background: p.badgeBg } : {}}>{p.badge}</span>
                  <span className="project-card-rera">RERA {p.category === 'upcoming' ? 'Pending' : 'Regd.'}</span>
                </div>
                <div className="project-card-body">
                  <h4>{p.name}</h4>
                  <div className="project-card-location"><i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)' }}></i> {p.location}</div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--gray-dark)', marginBottom: '1rem' }}>{p.desc}</p>
                  <div className="project-card-meta">
                    <div className="project-card-price">{p.price} <span>onwards</span></div>
                    {p.registerInterest
                      ? <button className="btn btn-outline-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem' }} onClick={(e) => { e.stopPropagation(); setBookingOpen(true) }}>Register Interest</button>
                      : <Link to="/project-detail" className="btn btn-outline-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem' }} onClick={e => e.stopPropagation()}>View Details</Link>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '3.5rem' }}>
            <Link to="/projects" className="btn btn-navy"><i className="fas fa-th-large"></i> View All Projects</Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-pad bg-navy" id="why">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Why Omkara</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>The Omkara <span>Difference</span></h2>
            <div className="gold-divider center"></div>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.65)' }}>Four pillars that have defined our excellence for over two decades.</p>
          </div>
          <div className="why-grid">
            {[{ icon: 'fa-medal', title: 'Unmatched Quality', desc: 'From foundation to finishes, every Omkara home is built with precision engineering and imported premium materials sourced globally.', d: '' }, { icon: 'fa-calendar-check', title: 'Timely Delivery', desc: 'With a 100% on-time delivery record across 42 projects, we honor our commitments. Your dream home, on schedule.', d: 'delay-1' }, { icon: 'fa-lightbulb', title: 'Smart Innovation', desc: 'Home automation, smart security, AI-powered energy management — we integrate cutting-edge technology into every home.', d: 'delay-2' }, { icon: 'fa-star', title: 'Premium Locations', desc: 'Strategic prime addresses offering the highest ROI, superior connectivity, and proximity to the finest schools, hospitals & retail.', d: 'delay-3' }].map(w => (
              <div key={w.title} className={`why-card animate-on-scroll ${w.d}`}>
                <div className="why-icon"><i className={`fas ${w.icon}`}></i></div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="section-pad" id="amenities">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Lifestyle Amenities</span>
            <h2 className="section-title">Where Every <span>Detail</span> Matters</h2>
            <div className="gold-divider center"></div>
            <p style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>Curated world-class amenities designed to elevate your everyday living into an extraordinary experience.</p>
          </div>
          <div className="amenities-grid">
            {amenities.map(a => (
              <div key={a.label} className={`amenity-item animate-on-scroll ${a.delay}`}>
                <div className="amenity-icon">{a.icon}</div>
                <div className="amenity-label">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D WALKTHROUGH */}
      <section className="walkthrough-section section-pad">
        <div className="walkthrough-bg"></div>
        <div className="container">
          <div className="walkthrough-content">
            <div className="animate-on-scroll">
              <div className="walkthrough-video-frame">
                <div className="walkthrough-placeholder" onClick={() => setVideoOpen(true)}>
                  <div className="play-btn"><i className="fas fa-play"></i></div>
                  <div className="walkthrough-text">Experience in 3D</div>
                </div>
              </div>
            </div>
            <div className="walkthrough-info animate-on-scroll delay-2">
              <span className="section-label">Virtual Experience</span>
              <h2 className="section-title" style={{ color: 'var(--white)' }}>Explore Your <span>Future Home</span> in 3D</h2>
              <div className="gold-divider"></div>
              <p>Step inside your dream home before it's built. Our immersive 3D walkthrough technology lets you experience every room, material, and view with stunning photorealistic detail.</p>
              <div className="walkthrough-features">
                {[{ icon: 'fa-vr-cardboard', text: 'Immersive VR-compatible 360° property tours' }, { icon: 'fa-cube', text: 'Photorealistic 3D renders of interiors & exteriors' }, { icon: 'fa-video', text: 'Live video walkthroughs with our experts' }].map(f => (
                  <div key={f.text} className="walkthrough-feature">
                    <div className="walkthrough-feature-icon"><i className={`fas ${f.icon}`}></i></div>
                    <div className="walkthrough-feature-text">{f.text}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold" onClick={() => setVideoOpen(true)}><i className="fas fa-play"></i> Experience in 3D</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" id="testimonials">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Client Voices</span>
            <h2 className="section-title">Trusted by <span>Thousands</span></h2>
            <div className="gold-divider center"></div>
            <p style={{ maxWidth: '500px', margin: '0 auto 3rem' }}>The most gratifying measure of our excellence is the trust our homeowners place in us, generation after generation.</p>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="testimonials-track" ref={trackRef}>
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <div className="testimonial-stars">★★★★★</div>
                  <p className="testimonial-text">{t.quote}</p>
                  <div className="testimonial-author">
                    <img src={t.img} alt={t.name} className="testimonial-author-img" />
                    <div className="testimonial-author-info"><h5>{t.name}</h5><p>{t.role}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonials-nav">
            <button className="testi-nav-btn" onClick={() => moveTestimonials(-1)}><i className="fas fa-chevron-left"></i></button>
            <button className="testi-nav-btn" onClick={() => moveTestimonials(1)}><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <span className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Exclusive Offer</span>
            <h2>Book Your <span style={{ color: 'var(--gold)' }}>Dream Home</span> Today</h2>
            <p>Limited inventory across premium projects. Connect with our expert advisors for personalized guidance and exclusive pre-launch pricing.</p>
            <div className="cta-actions">
              <button className="btn btn-gold" onClick={() => setBookingOpen(true)}><i className="fas fa-calendar-check"></i> Book Site Visit</button>
              <Link to="/projects" className="btn btn-outline-white"><i className="fas fa-building"></i> View All Projects</Link>
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
