import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Investor from './pages/Investor'
import Blog from './pages/Blog'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Rera from './pages/Rera'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project-detail" element={<ProjectDetail />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rera" element={<Rera />} />
      </Routes>
    </BrowserRouter>
  )
}
