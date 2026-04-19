import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

const posts = [
  { category: 'market', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', cat: 'Market Insights', title: "Why Mumbai's Luxury Real Estate Is Poised for a 40% Surge in 2025", excerpt: 'Infrastructure upgrades, rising NRI demand, and constrained supply in premium micro-markets are setting the stage for exceptional appreciation...', date: 'Mar 15, 2025', read: '6 min read', views: '12.4K views' },
  { category: 'design', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', cat: 'Design & Living', title: 'The Art of Biophilic Design: How Nature Transforms Luxury Homes', excerpt: 'Leading architects are reimagining urban living by integrating natural elements — light, greenery, and organic materials — into every design decision...', date: 'Feb 28, 2025', read: '5 min read', views: '8.7K views' },
  { category: 'investment', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80', cat: 'Investment', title: 'Real Estate vs. Equities: Why Ultra-HNI Indians Are Betting on Luxury Property', excerpt: "A deep dive into the portfolio strategies of India's wealthiest investors, and why tangible assets like premium real estate continue to outperform...", date: 'Feb 10, 2025', read: '9 min read', views: '22.1K views' },
  { category: 'news', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', cat: 'Company News', title: 'Omkara Greens Achieves IGBC Platinum Green Building Certification', excerpt: 'Our Whitefield, Bengaluru township has become the first integrated development in South India to achieve IGBC Platinum status across all phases...', date: 'Jan 22, 2025', read: '4 min read', views: '5.2K views' },
  { category: 'market', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', cat: 'Market Insights', title: "Bengaluru's Office Market: Why IT Corridors Are India's Best Commercial Bet", excerpt: 'With global tech companies doubling down on India\'s talent pool, Grade-A office spaces in Whitefield and ORR are seeing unprecedented demand...', date: 'Jan 8, 2025', read: '7 min read', views: '9.8K views' },
  { category: 'design', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', cat: 'Design & Living', title: 'Smart Homes 2025: Automation Technologies Reshaping Luxury Living', excerpt: 'From AI-powered climate control to voice-activated security, the latest home automation trends are redefining what it means to live in luxury...', date: 'Dec 18, 2024', read: '6 min read', views: '15.3K views' },
  { category: 'investment', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80', cat: 'Investment', title: 'NRI Property Investment Guide: FEMA, Taxes & Repatriation in 2025', excerpt: "Everything the non-resident Indian needs to know about legally and profitably investing in India's premium real estate market...", date: 'Dec 5, 2024', read: '11 min read', views: '31.5K views' },
  { category: 'news', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', cat: 'Company News', title: 'Possession Ceremony: 420 Families Welcome Their New Homes at Elysium Phase 2', excerpt: 'A milestone for Omkara and 420 proud homeowners — Elysium Phase 2 possession ceremony saw families step into their dream homes ahead of schedule...', date: 'Nov 20, 2024', read: '3 min read', views: '6.4K views' },
  { category: 'market', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', cat: 'Market Insights', title: "Hyderabad's Financial District: India's Next Real Estate Hotspot", excerpt: "With global tech companies, pharma giants, and data centers choosing Hyderabad as their India headquarters, the city's premium real estate corridor is on fire...", date: 'Nov 3, 2024', read: '8 min read', views: '18.9K views' },
]

export default function Blog() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [newsletterDone, setNewsletterDone] = useState(false)
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.category === activeFilter)

  return (
    <>
      <Navbar />
      <PageHero title="News & Insights" breadcrumb="News & Blog" bgImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80" />

      <section className="section-pad">
        <div className="container">
          {/* FEATURED */}
          <div className="animate-on-scroll" style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', background: 'var(--off-white)', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" alt="Featured" style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
              <div style={{ padding: '3rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem', display: 'block' }}>Company News · April 2025</span>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--navy)' }}>Omkara Group Records ₹3,100 Cr Revenue in FY2024 — A New Milestone</h2>
                <p style={{ marginBottom: '1.5rem' }}>In a landmark year for India's luxury real estate sector, Omkara Group Estate announces its strongest financial performance, with revenue growing 32% YoY.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Author" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--gray-dark)' }}>By <strong>Vikram Anand</strong> · 8 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER */}
          <div className="projects-filter animate-on-scroll" style={{ marginBottom: '2.5rem' }}>
            {['all', 'news', 'market', 'design', 'investment'].map(f => (
              <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
                {f === 'all' ? 'All Articles' : f === 'news' ? 'Company News' : f === 'market' ? 'Market Insights' : f === 'design' ? 'Design & Living' : 'Investment'}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="blog-grid">
            {filtered.map((p, i) => (
              <div key={i} className={`blog-card animate-on-scroll ${i % 3 === 1 ? 'delay-1' : i % 3 === 2 ? 'delay-2' : ''}`} data-category={p.category}>
                <img src={p.img} alt={p.cat} className="blog-card-img" />
                <div className="blog-card-body">
                  <div className="blog-card-cat">{p.cat}</div>
                  <h4>{p.title}</h4>
                  <p>{p.excerpt}</p>
                  <div className="blog-card-meta">
                    <span><i className="fas fa-calendar"></i> {p.date}</span>
                    <span><i className="fas fa-clock"></i> {p.read}</span>
                    <span><i className="fas fa-eye"></i> {p.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '4rem' }}>
            <button className="btn btn-outline-gold"><i className="fas fa-plus"></i> Load More Articles</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }} className="animate-on-scroll">
            <span className="section-label">Stay Informed</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Subscribe to Our <span>Newsletter</span></h2>
            <div className="gold-divider center"></div>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem' }}>Get the latest real estate insights, project launches, and market intelligence delivered to your inbox.</p>
            {!newsletterDone ? (
              <form onSubmit={e => { e.preventDefault(); setNewsletterDone(true) }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input type="email" className="form-control" placeholder="Enter your email address" required style={{ flex: 1, minWidth: '240px', background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'var(--white)' }} />
                <button type="submit" className="btn btn-gold"><i className="fas fa-paper-plane"></i> Subscribe</button>
              </form>
            ) : (
              <p style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 600 }}>✓ You are now subscribed! Welcome to the Omkara community.</p>
            )}
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
