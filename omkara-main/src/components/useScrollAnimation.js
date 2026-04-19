import { useEffect } from 'react'

export default function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animated')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}
