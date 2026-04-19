import { useEffect } from 'react'

export default function useCounter() {
  useEffect(() => {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0
      const timer = setInterval(() => {
        current += step
        if (current >= target) { current = target; clearInterval(timer) }
        el.textContent = Math.floor(current).toLocaleString('en-IN')
      }, 16)
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target) }
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}
