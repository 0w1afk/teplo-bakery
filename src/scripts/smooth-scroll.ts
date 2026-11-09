// Единственная точка smooth scroll на сайте (скилл lenis-scroll).
// Один цикл: GSAP ticker ведёт Lenis; при prefers-reduced-motion Lenis не создаётся.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initSmoothScroll(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
  const update = (time: number) => lenis.raf(time * 1000) // ticker — секунды, Lenis — миллисекунды

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(update)
  gsap.ticker.lagSmoothing(0)

  const onAnchor = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
    const id = a?.getAttribute('href')
    if (!a || !id || id.length < 2) return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target as HTMLElement)
  }
  document.addEventListener('click', onAnchor)

  return () => {
    document.removeEventListener('click', onAnchor)
    gsap.ticker.remove(update)
    lenis.destroy()
  }
}
