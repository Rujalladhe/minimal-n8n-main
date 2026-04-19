import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

const allProjects = [
  { id: 1, category: 'residential', price: 45000000, name: 'Shivalaya', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', badge: 'Ready to Move', rera: 'P51800045678', location: 'Bandra West, Mumbai', desc: 'Ultra-luxury 3 & 4 BHK residences with panoramic sea views, private terraces and world-class amenities.', config: '3-4 BHK', area: '2,100–3,800 sqft', floors: '42 Floors', priceLabel: '₹4.5 Cr' },
  { id: 2, category: 'commercial', price: 22000000, name: 'Villa doria', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', badge: 'New Launch', badgeBg: 'var(--navy)', rera: 'P51900056789', location: 'BKC, Mumbai', desc: 'Grade-A commercial offices and retail spaces in the heart of Bandra-Kurla Complex with LEED certification.', config: 'Office / Retail', area: '1,000–10,000 sqft', floors: '28 Floors', priceLabel: '₹2.2 Cr' },
]

export default function Projects() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  let filtered = activeFilter === 'all' ? allProjects : allProjects.filter(p => p.category === activeFilter)
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()))
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <Navbar />
      <PageHero title="Our Projects" breadcrumb="Projects" bgImage="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80" />

      <section className="section-pad">
        <div className="container">
          <div className="animate-on-scroll">
            <div className="projects-filter">
              {['all', 'residential', 'commercial', 'township', 'upcoming'].map(f => (
                <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
                  {f === 'all' ? 'All Projects' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="search-bar">
              <input type="text" className="search-input" placeholder="Search projects by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
              <span className="project-count">Showing {filtered.length} Project{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="projects-page-grid" id="projectsGrid">
            {filtered.map((p, i) => (
              <div key={p.id} className={`project-card animate-on-scroll ${i % 3 === 1 ? 'delay-1' : i % 3 === 2 ? 'delay-2' : ''}`} data-category={p.category}>
                <div style={{ overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.name} className="project-card-img" />
                  <span className="project-card-badge" style={p.badgeBg ? { background: p.badgeBg } : {}}>{p.badge}</span>
                  <span className="project-card-rera">RERA: {p.rera}</span>
                </div>
                <div className="project-card-body">
                  <h4>{p.name}</h4>
                  <div className="project-card-location"><i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)' }}></i> {p.location}</div>
                  <p style={{ fontSize: '0.83rem', marginBottom: '1rem' }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--gray-dark)' }}>
                    <span><i className="fas fa-building" style={{ color: 'var(--gold)' }}></i> {p.config}</span>
                    <span><i className="fas fa-vector-square" style={{ color: 'var(--gold)' }}></i> {p.area}</span>
                    <span><i className="fas fa-layer-group" style={{ color: 'var(--gold)' }}></i> {p.floors}</span>
                  </div>
                  <div className="project-card-meta">
                    <div className="project-card-price">{p.priceLabel} <span>onwards</span></div>
                    {p.register
                      ? <button className="btn btn-outline-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem' }} onClick={() => setBookingOpen(true)}>Register</button>
                      : <Link to="/project-detail" className="btn btn-outline-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem' }}>View Details</Link>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NRI SECTION */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="animate-on-scroll">
              <span className="section-label">NRI Investment</span>
              <h2 className="section-title" style={{ color: 'var(--white)' }}>Invest in India's <span>Finest</span> Real Estate</h2>
              <div className="gold-divider"></div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>NRI investors from the US, UK, UAE, Singapore and across the globe trust Omkara for secure, high-yield real estate investments in India's premium markets.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                {['Complete FEMA & RBI compliant transactions', 'Dedicated NRI relationship manager', 'Virtual site visits & digital documentation', 'Premium rental management post-possession'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem' }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--gold)' }}></i> {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-gold" onClick={() => setBookingOpen(true)}><i className="fas fa-globe"></i> Connect with NRI Desk</button>
            </div>
            <div className="animate-on-scroll delay-2">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&q=80" alt="NRI Investment" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-dark)', border: '2px solid rgba(201,168,76,0.3)' }} />
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
