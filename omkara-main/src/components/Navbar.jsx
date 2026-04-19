import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navClass = isHome
    ? scrolled ? 'navbar scrolled' : 'navbar transparent'
    : 'navbar white-nav'

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/investor', label: 'Investors' },
    { to: '/blog', label: 'News' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={navClass} id="navbar">
        <Link to="/" className="nav-logo">
          <span className="logo-text" style={!isHome || scrolled ? { color: 'var(--navy)' } : {}}>Omkara Group</span>
          <span className="logo-sub">Estate</span>
        </Link>
        <ul className="nav-menu" id="navMenu">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="btn btn-gold" onClick={() => window.openBookingModal && window.openBookingModal()}>Book Site Visit</button>
        </div>
        <button className="hamburger" id="hamburger" aria-label="Menu" onClick={() => setMobileOpen(true)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-overlay${mobileOpen ? ' show' : ''}`} onClick={() => setMobileOpen(false)}></div>
      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobileNav">
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}><i className="fas fa-times"></i></button>
        <ul>
          {links.map(l => (
            <li key={l.to}><Link to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link></li>
          ))}
          <li><Link to="/rera" onClick={() => setMobileOpen(false)}>RERA Compliance</Link></li>
        </ul>
        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setMobileOpen(false); window.openBookingModal && window.openBookingModal() }}>
            <i className="fas fa-calendar-alt"></i> Book Site Visit
          </button>
        </div>
      </nav>
    </>
  )
}
