import { Link } from 'react-router-dom'

export default function PageHero({ title, breadcrumb, bgImage }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg"></div>
      <div className="page-hero-img" style={{ backgroundImage: `url('${bgImage}')` }}></div>
      <div className="page-hero-overlay"></div>
      <div className="container">
        <div className="page-hero-content">
          <h1>{title}</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{breadcrumb}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
