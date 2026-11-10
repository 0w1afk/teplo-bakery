/* Анимации сайта «Тепло».
   Fade-эффектов нет: текст и фото статичны при входе в кадр.
   Остались: параллакс фото и таймлайн выпечки.
   prefers-reduced-motion: GSAP-сцены не создаются, статичный кадр.
   Smooth scroll (Lenis) инициализируется в Base.astro отдельно (скилл lenis-scroll). */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ——— Мобильное меню (мгновенно, без анимации) ——— */

const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
const nav = document.getElementById('siteNav')

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false
  toggle.setAttribute('aria-expanded', String(open))
})

nav?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.matches('a')) {
    nav.classList.remove('open')
    toggle?.setAttribute('aria-expanded', 'false')
  }
})

/* ——— Пульт: модель в минутах от 00:00 дня 1 ——— */

const START = 21 * 60 // 21:00 день 1
const SPAN = 32 * 60 // до 05:00 день 3 — «сутки с хвостом»
const STOPS = [21 * 60, 34 * 60, 35 * 60, 53 * 60] // 21:00 / 10:00 / 11:00 / 05:00

function clockParts(min: number) {
  const total = Math.round(min / 5) * 5 // шаг 5 минут — часы «тикают», не дрожат
  const day = Math.floor(total / 1440) + 1
  const h = Math.floor((total % 1440) / 60)
  const m = total % 60
  return {
    time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    day: `день ${day}`,
  }
}

const bench = document.querySelector<HTMLElement>('.bench')
const axis = document.querySelector<HTMLElement>('.bench-axis')
const currentTime = document.getElementById('benchCurrentTime')
const currentDay = document.getElementById('benchCurrentDay')
const milestones = gsap.utils.toArray<HTMLElement>('.milestone')

function setBench(progress: number) {
  if (!axis || !currentTime || !currentDay) return
  const min = START + progress * SPAN
  const parts = clockParts(min)
  currentTime.textContent = parts.time
  currentDay.textContent = parts.day
  // Позиция маркера и текущего времени — одно свойство на оси
  axis.style.setProperty('--p', progress.toFixed(4))
  let best = 0
  STOPS.forEach((stop, i) => {
    if (Math.abs(min - stop) < Math.abs(min - STOPS[best]!)) best = i
  })
  milestones.forEach((m, i) => {
    m.classList.toggle('is-active', i === best)
    m.classList.toggle('is-dimmed', i !== best)
  })
}

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // 1. Параллакс фото — scrub, ±14px
  gsap.utils.toArray<HTMLElement>('.parallax').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 14 },
      {
        y: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })

  if (bench) {
    const trigger = ScrollTrigger.create({
      trigger: bench,
      start: 'top 70%',
      end: 'bottom 45%',
      onUpdate: self => setBench(self.progress),
    })
    setBench(trigger.progress)
  }
  return () => {
    axis?.style.removeProperty('--p')
    milestones.forEach(step => step.classList.remove('is-active', 'is-dimmed'))
  }
})
