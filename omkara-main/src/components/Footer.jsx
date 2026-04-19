import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-text">Omkara Group Estate</span>
            <span className="logo-sub">Building Landmarks. Creating Legacies.</span>
            <p>India's most trusted luxury real estate developer, creating iconic landmarks that stand as testaments to architectural excellence, premium quality, and visionary design.</p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Projects</h5>
            <ul>
              <li><Link to="/project-detail"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> Shivalaya</Link></li>
              <li><Link to="/project-detail"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> Villa doria</Link></li>
               </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link to="/about"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> About Us</Link></li>
              <li><Link to="/investor"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> Investor Relations</Link></li>
              <li><Link to="/blog"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> News &amp; Blog</Link></li>
              <li><Link to="/careers"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> Careers</Link></li>
              <li><Link to="/rera"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> RERA Compliance</Link></li>
              <li><Link to="/contact"><i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i> Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+918001234567"><i className="fas fa-phone" style={{ color: 'var(--gold)' }}></i> +91 800 123 4567</a></li>
              <li><a href="mailto:info@omkaragroup.com"><i className="fas fa-envelope" style={{ color: 'var(--gold)' }}></i> info@omkaragroup.com</a></li>
              <li><a href="#"><i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)' }}></i> BKC, Mumbai 400051</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Omkara Group Estate. All rights reserved. | <Link to="/rera">Legal Disclaimer</Link></p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>*All images are artist's impressions. Subject to RERA approvals.</p>
        </div>
      </div>
    </footer>
  )
}
