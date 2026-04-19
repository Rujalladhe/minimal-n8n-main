import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'
import useCounter from '../components/useCounter'

Chart.register(...registerables)

function RevenueChart() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels: ['2019','2020','2021','2022','2023','2024'], datasets: [{ label: 'Revenue (₹ Crore)', data: [1200,980,1450,1890,2340,3100], borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.08)', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#C9A84C', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0A1628', titleColor: '#C9A84C', bodyColor: '#fff', borderColor: '#C9A84C', borderWidth: 1 } }, scales: { y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#555' } }, x: { grid: { display: false }, ticks: { color: '#555' } } } }
    })
    return () => chart.destroy()
  }, [])
  return <canvas ref={ref}></canvas>
}

function MixChart() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['Residential','Commercial','Township','Retail'], datasets: [{ data: [55,25,15,5], backgroundColor: ['#C9A84C','#0A1628','#1C2E50','#E8C97A'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 20, color: '#555', font: { size: 12 } } } } }
    })
    return () => chart.destroy()
  }, [])
  return <canvas ref={ref}></canvas>
}

function DeliveryChart() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'bar',
      data: { labels: ['2019','2020','2021','2022','2023','2024'], datasets: [{ label: 'Units Delivered', data: [850,620,1100,1450,1820,2300], backgroundColor: 'rgba(201,168,76,0.8)', borderRadius: 4 }, { label: 'Units Sold', data: [920,780,1200,1600,2100,2800], backgroundColor: 'rgba(10,22,40,0.7)', borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#555' } }, tooltip: { backgroundColor: '#0A1628', titleColor: '#C9A84C', bodyColor: '#fff' } }, scales: { y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#555' } }, x: { grid: { display: false }, ticks: { color: '#555' } } } }
    })
    return () => chart.destroy()
  }, [])
  return <canvas ref={ref}></canvas>
}

const reports = [
  { icon: 'fa-file-pdf', title: 'Annual Report FY 2023–24', sub: 'Comprehensive financial statements & MD&A' },
  { icon: 'fa-file-pdf', title: 'Annual Report FY 2022–23', sub: 'Revenue ₹2,340 Cr | EBITDA 29%' },
  { icon: 'fa-file-pdf', title: 'Annual Report FY 2021–22', sub: 'Revenue ₹1,890 Cr | PAT ₹380 Cr' },
  { icon: 'fa-file-pdf', title: 'Annual Report FY 2020–21', sub: 'Revenue ₹1,450 Cr | Growth 48%' },
  { icon: 'fa-file-alt', title: 'Q2 FY2025 Results', sub: 'Quarterly earnings release — Oct 2024' },
]

const governance = [
  { icon: 'fa-shield-alt', title: 'Code of Conduct', sub: 'Ethics policy and business conduct standards', eye: true },
  { icon: 'fa-users', title: 'Board of Directors', sub: 'Board composition and committee charters', eye: true },
  { icon: 'fa-balance-scale', title: 'Audit Committee Report', sub: 'Independent audit findings FY2024' },
  { icon: 'fa-leaf', title: 'ESG Report FY2024', sub: 'Environmental, Social & Governance disclosures' },
  { icon: 'fa-chart-pie', title: 'Shareholding Pattern', sub: 'Q3 FY2025 shareholding disclosure', eye: true },
]

export default function Investor() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [irDone, setIrDone] = useState(false)
  useScrollAnimation()
  useCounter()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  return (
    <>
      <Navbar />
      <PageHero title="Investor Relations" breadcrumb="Investor Relations" bgImage="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80" />

      {/* FINANCIAL HIGHLIGHTS */}
      <section className="section-pad-sm bg-navy">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
            {[{ label: 'Revenue FY2024', count: 3100, unit: 'Crore INR', d: '' }, { label: 'EBITDA Margin', count: 32, unit: 'Percent', d: 'delay-1' }, { label: 'Market Cap', count: 18, unit: 'Thousand Crore', d: 'delay-2' }, { label: 'Dividend Yield', count: 3, unit: 'Percent', d: 'delay-3' }].map(f => (
              <div key={f.label} className={`animate-on-scroll ${f.d} text-center`} style={{ padding: '2rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{f.label}</div>
                <div className="stat-num" data-count={f.count}>0</div>
                <div className="stat-label">{f.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Financial Performance</span>
            <h2 className="section-title">Consistent <span>Growth</span> Story</h2>
            <div className="gold-divider center"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginTop: '3rem' }}>
            <div className="animate-on-scroll">
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--navy)' }}>Revenue Growth (₹ Crore)</h4>
              <div style={{ height: '320px', position: 'relative' }}><RevenueChart /></div>
            </div>
            <div className="animate-on-scroll delay-2">
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--navy)' }}>Revenue Mix</h4>
              <div style={{ height: '260px', position: 'relative' }}><MixChart /></div>
            </div>
          </div>
          <div className="animate-on-scroll" style={{ marginTop: '4rem' }}>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--navy)' }}>Delivery vs Sales (Units)</h4>
            <div style={{ height: '300px', position: 'relative' }}><DeliveryChart /></div>
          </div>
        </div>
      </section>

      {/* CHAIRMAN'S MESSAGE */}
      <section className="section-pad bg-off-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'center' }}>
            <div className="animate-on-scroll text-center">
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Vikram Anand" style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--gold)', boxShadow: '0 10px 40px rgba(201,168,76,0.2)', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Vikram Anand</h3>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Chairman &amp; Managing Director</p>
            </div>
            <div className="animate-on-scroll delay-2">
              <span className="section-label">Chairman's Message</span>
              <h2 className="section-title">A Letter to Our <span>Investors</span></h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '1.2rem', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--navy)', fontFamily: 'var(--font-primary)' }}>"Dear Fellow Shareholders,"</p>
              <p style={{ marginBottom: '1rem' }}>I am proud to report that FY2024 has been our strongest year yet. With revenue crossing ₹3,100 crore and an EBITDA margin of 32%, Omkara Group Estate has firmly established itself as India's most trusted luxury developer.</p>
              <p style={{ marginBottom: '1rem' }}>Our strategy remains clear: premium locations, uncompromising quality, and technology-led customer experience. As India's real estate market continues its structural bull run, we are uniquely positioned to capitalize on the insatiable demand for luxury housing.</p>
              <p style={{ marginBottom: '2rem' }}>With 9 new projects launching in FY2025 across Mumbai, Bengaluru, and Hyderabad, and a robust pipeline of ₹18,000 crore in pre-sales, the best is yet to come for our shareholders.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '80px', height: '2px', background: 'var(--gold)' }}></div>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--navy)' }}>— Vikram Anand</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPORTS & GOVERNANCE */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
            <div className="animate-on-scroll">
              <span className="section-label">Downloads</span>
              <h2 className="section-title">Annual <span>Reports</span></h2>
              <div className="gold-divider"></div>
              <div style={{ marginTop: '2rem' }}>
                {reports.map(r => (
                  <div key={r.title} className="report-card">
                    <div className="report-icon"><i className={`fas ${r.icon}`}></i></div>
                    <div className="report-info"><h5>{r.title}</h5><p>{r.sub}</p></div>
                    <a href="#" className="report-download"><i className="fas fa-download"></i></a>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-on-scroll delay-2">
              <span className="section-label">Governance</span>
              <h2 className="section-title">Corporate <span>Governance</span></h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '2rem' }}>Omkara Group Estate upholds the highest standards of corporate governance, ensuring transparency, accountability, and sustainable value creation for all stakeholders.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {governance.map(g => (
                  <div key={g.title} className="report-card">
                    <div className="report-icon"><i className={`fas ${g.icon}`}></i></div>
                    <div className="report-info"><h5>{g.title}</h5><p>{g.sub}</p></div>
                    <a href="#" className="report-download"><i className={`fas ${g.eye ? 'fa-eye' : 'fa-download'}`}></i></a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STOCK INFO */}
      <section className="section-pad bg-navy">
        <div className="container">
          <div className="text-center animate-on-scroll" style={{ marginBottom: '3rem' }}>
            <span className="section-label">Stock Information</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Omkara Group on <span>NSE &amp; BSE</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
            {[{ label: 'NSE Symbol', val: 'OMKARARE', sub: 'National Stock Exchange', color: 'var(--white)' }, { label: 'Current Price', val: '₹842.50', sub: '▲ +2.4% Today', color: 'var(--white)', subColor: '#4CAF50' }, { label: '52-Week Range', val: '₹580–920', sub: 'P/E Ratio: 28.4x', color: 'var(--white)' }].map(s => (
              <div key={s.label} className="animate-on-scroll text-center" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{s.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-primary)' }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: s.subColor || 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>*Stock prices are illustrative. Please refer to NSE/BSE for live data.</p>
        </div>
      </section>

      {/* IR CONTACT */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="animate-on-scroll">
              <span className="section-label">Investor Contact</span>
              <h2 className="section-title">Get in Touch with Our <span>IR Team</span></h2>
              <div className="gold-divider"></div>
              <p style={{ marginBottom: '2rem' }}>Our Investor Relations team is committed to maintaining transparent, timely, and consistent communication with all shareholders and potential investors.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[{ icon: 'fa-user-tie', title: 'Suresh Iyer — Head, Investor Relations', sub: 'ir@omkaragroup.com' }, { icon: 'fa-phone', title: '+91 22 4800 5678', sub: 'Mon–Fri, 9AM–6PM IST' }, { icon: 'fa-map-marker-alt', title: 'Omkara House, BKC', sub: 'Mumbai — 400051, Maharashtra' }].map(c => (
                  <div key={c.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(201,168,76,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}><i className={`fas ${c.icon}`}></i></div>
                    <div><div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)' }}>{c.title}</div><div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{c.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-on-scroll delay-2">
              <div style={{ background: 'var(--off-white)', padding: '2.5rem', borderRadius: '12px', border: '1.5px solid rgba(201,168,76,0.15)' }}>
                <h4 style={{ marginBottom: '1.5rem', color: 'var(--navy)' }}>Investor Query</h4>
                {!irDone ? (
                  <form onSubmit={e => { e.preventDefault(); setIrDone(true) }}>
                    <div className="form-group"><label className="form-label">Name *</label><input type="text" className="form-control" required /></div>
                    <div className="form-group"><label className="form-label">Organization</label><input type="text" className="form-control" placeholder="Fund / Company name" /></div>
                    <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" required /></div>
                    <div className="form-group"><label className="form-label">Query Type</label><select className="form-control"><option>Annual Report</option><option>Stock Information</option><option>Dividend Query</option><option>Analyst Meeting</option><option>Other</option></select></div>
                    <div className="form-group"><label className="form-label">Message</label><textarea className="form-control" rows="3" placeholder="Your query..."></textarea></div>
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}><i className="fas fa-paper-plane"></i> Submit Query</button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--gold)' }}><i className="fas fa-check-circle"></i></div>
                    <h4 style={{ color: 'var(--navy)', marginTop: '1rem' }}>Query Submitted!</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Our IR team will respond within 24 hours.</p>
                  </div>
                )}
              </div>
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
