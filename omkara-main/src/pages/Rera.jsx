import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import BookingModal from '../components/BookingModal'
import Chatbot from '../components/Chatbot'
import WhatsApp from '../components/WhatsApp'
import useScrollAnimation from '../components/useScrollAnimation'

const reraProjects = [
  { name: 'Shivalaya', location: 'Bandra West, Mumbai', reg: 'P51800045678', auth: 'MahaRERA', valid: 'Dec 2025', status: 'active' },
  { name: 'Villa doria', location: 'BKC, Mumbai', reg: 'P51900056789', auth: 'MahaRERA', valid: 'Mar 2026', status: 'active' },
  { name: 'Omkara Greens Township', location: 'Whitefield, Bengaluru', reg: 'P52100067890', auth: 'K-RERA', valid: 'Jun 2027', status: 'active' },
  { name: 'Omkara Pinnacle', location: 'Juhu, Mumbai', reg: 'P51900034567', auth: 'MahaRERA', valid: 'Sep 2025', status: 'active' },
  { name: 'Omkara Square', location: 'Cybercity, Gurugram', reg: 'P52300078901', auth: 'HRERA', valid: 'Aug 2026', status: 'active' },
  { name: 'Omkara Serene', location: 'Wakad, Pune', reg: 'P52000089012', auth: 'MahaRERA', valid: 'Nov 2025', status: 'active' },
  { name: 'Omkara City', location: 'ORR, Hyderabad', reg: 'P52200090123', auth: 'TSRERA', valid: 'Apr 2028', status: 'active' },
  { name: 'Omkara Nexus', location: 'Financial District, Hyderabad', reg: '— Pending Registration', auth: 'TSRERA', valid: '—', status: 'pending' },
  { name: 'Omkara Marina', location: 'OMR, Chennai', reg: '— Pending Registration', auth: 'TNRERA', valid: '—', status: 'pending' },
]

const certs = [
  { icon: 'fa-file-pdf', title: 'RERA Certificates Bundle', sub: 'All active project certificates' },
  { icon: 'fa-file-alt', title: 'Building Plan Approvals', sub: 'Municipal corporation sanctions' },
  { icon: 'fa-certificate', title: 'Commencement Certificates', sub: 'All ongoing projects' },
  { icon: 'fa-leaf', title: 'Environmental Clearances', sub: 'Ministry of Environment approvals' },
  { icon: 'fa-home', title: 'Occupancy Certificates', sub: 'Completed and delivered projects' },
  { icon: 'fa-fire', title: 'Fire NOC Certificates', sub: 'Fire department approvals' },
]

export default function Rera() {
  const [bookingOpen, setBookingOpen] = useState(false)
  useScrollAnimation()
  useEffect(() => { window.openBookingModal = () => setBookingOpen(true); return () => { delete window.openBookingModal } }, [])

  return (
    <>
      <Navbar />
      <PageHero title="RERA Compliance" breadcrumb="RERA Compliance" bgImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80" />

      {/* INTRO */}
      <section className="section-pad-sm bg-navy">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', textAlign: 'center' }}>
            {[{ icon: 'fa-shield-alt', title: '100% RERA Compliant', desc: 'All active projects registered under respective state RERA authorities', d: '' }, { icon: 'fa-balance-scale', title: 'Full Transparency', desc: 'Complete project details, approvals and progress reports available online', d: 'delay-1' }, { icon: 'fa-file-contract', title: 'Zero Disputes', desc: 'No pending RERA complaints or regulatory actions as of April 2025', d: 'delay-2' }].map(i => (
              <div key={i.title} className={`animate-on-scroll ${i.d}`}>
                <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '0.8rem' }}><i className={`fas ${i.icon}`}></i></div>
                <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '1rem' }}>{i.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="section-pad">
        <div className="container">
          <div className="animate-on-scroll" style={{ marginBottom: '1rem' }}>
            <span className="section-label">Project Registration</span>
            <h2 className="section-title">RERA <span>Registration Details</span></h2>
            <div className="gold-divider"></div>
            <p style={{ maxWidth: '700px', marginBottom: '3rem' }}>All Omkara Group Estate projects are registered with the respective State Real Estate Regulatory Authority as mandated under the Real Estate (Regulation and Development) Act, 2016.</p>
          </div>
          <div style={{ overflowX: 'auto' }} className="animate-on-scroll">
            <table className="rera-table">
              <thead>
                <tr><th>Project Name</th><th>Location</th><th>RERA Reg. Number</th><th>Authority</th><th>Valid Until</th><th>Status</th><th>Documents</th></tr>
              </thead>
              <tbody>
                {reraProjects.map(p => (
                  <tr key={p.name}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.location}</td>
                    <td>{p.status === 'active' ? <span className="rera-reg-badge"><i className="fas fa-check"></i> {p.reg}</span> : p.reg}</td>
                    <td>{p.auth}</td>
                    <td>{p.valid}</td>
                    <td>{p.status === 'active' ? <span className="rera-status-active">✓ Active</span> : <span className="rera-status-pending">⏳ Pending</span>}</td>
                    <td>{p.status === 'active' ? <a href="#" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}><i className="fas fa-download"></i> Download</a> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CERTS */}
          <div style={{ marginTop: '3rem' }} className="animate-on-scroll">
            <h3 style={{ marginBottom: '2rem', color: 'var(--navy)' }}>Download Approvals &amp; Certificates</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {certs.map(c => (
                <div key={c.title} className="report-card">
                  <div className="report-icon"><i className={`fas ${c.icon}`}></i></div>
                  <div className="report-info"><h5>{c.title}</h5><p>{c.sub}</p></div>
                  <a href="#" className="report-download"><i className="fas fa-download"></i></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL DISCLAIMER */}
      <section className="section-pad bg-off-white">
        <div className="container">
          <div className="animate-on-scroll">
            <span className="section-label">Legal Information</span>
            <h2 className="section-title">Legal <span>Disclaimer</span></h2>
            <div className="gold-divider"></div>
          </div>
          <div style={{ marginTop: '3rem' }}>
            <div className="disclaimer-box animate-on-scroll">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'var(--gold)', fontSize: '1.3rem' }}></i>
                <h4 style={{ color: 'var(--navy)', margin: 0, fontSize: '0.95rem', fontFamily: 'var(--font-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Important Disclaimer</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-dark)', lineHeight: 1.9 }}>This website and its contents are for information purposes only and shall not be construed as an advertisement, solicitation, offer, or invitation to buy, invest, or subscribe to any property, securities, or financial instruments. All information, images, floor plans, and specifications shown on this website are subject to change without prior notice.</p>
            </div>

            {[{ title: 'Images & Representations', content: "All images, photographs, renderings, and artist's impressions shown on this website are for illustrative purposes only and represent anticipated design outcomes. The actual product may vary from the depicted visualizations." }, { title: 'Price & Specifications', list: ['All prices quoted are indicative and subject to change without prior notice.', 'Prices may vary based on floor level, unit size, view, and premium charges.', 'All prices are exclusive of applicable taxes, GST, stamp duty, registration charges, and other statutory levies.', 'Specifications, amenities, and floor plans are subject to architectural/structural changes as per regulatory or technical requirements.'] }, { title: 'RERA Compliance', content: 'Omkara Group Estate is committed to full compliance with the Real Estate (Regulation and Development) Act, 2016 (RERA). All projects are registered with the respective State RERA Authority before launch.', links: [['MahaRERA', 'https://maharera.mahaonline.gov.in'], ['K-RERA', 'https://rera.karnataka.gov.in'], ['TSRERA', 'https://rera.telangana.gov.in'], ['HRERA', 'https://hrera.gov.in'], ['TNRERA', 'https://www.tnrera.in']] }, { title: 'Investment Risk', content: 'Real estate investments are subject to market risks. Past appreciation in property values is not indicative of future performance. Buyers/investors are advised to conduct their own independent due diligence before making any investment decision.' }, { title: 'Privacy Policy', content: 'By submitting your personal information through this website, you consent to Omkara Group Estate and its authorized agents contacting you with relevant information about our projects and services. We do not sell, rent, or share your personal information with third parties for marketing purposes.' }, { title: 'Grievance Redressal', list: ['Grievance Officer: Mr. Aditya Singh, Chief Compliance Officer', 'Email: grievance@omkaragroup.com', 'Phone: +91 22 4800 5679', 'Address: Omkara House, 12th Floor, BKC, Mumbai 400051', 'Complaints are acknowledged within 48 hours and resolved within 30 days.'] }].map(s => (
              <div key={s.title} className="legal-section animate-on-scroll">
                <h4>{s.title}</h4>
                {s.content && <p>{s.content}</p>}
                {s.list && <ul>{s.list.map((l, i) => <li key={i}>{l}</li>)}</ul>}
                {s.links && <ul>{s.links.map(([name, url]) => <li key={name}>{name}: <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>{url.replace('https://', '')}</a></li>)}</ul>}
              </div>
            ))}

            <div className="legal-section animate-on-scroll" style={{ background: 'rgba(10,22,40,0.04)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <h4>Effective Date</h4>
              <p>This disclaimer and all legal notices are effective as of April 10, 2025 and are subject to revision without prior notice. Last updated: April 10, 2025.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--gray)' }}>CIN: U70100MH2001PLC135678 | GSTIN: 27AACCO5678H1Z5</p>
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
