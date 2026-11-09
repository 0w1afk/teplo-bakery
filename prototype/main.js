/* Мука — прототип, этап 5. GSAP + ScrollTrigger (CDN).
   Режимы: reveal — toggle; параллакс и выходы за сетку — scrub; пульт — scrub.
   prefers-reduced-motion: всё статично, пульт показывает крайние вехи. */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

/* ——— Мобильное меню (без анимации, мгновенно) ——— */

const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("siteNav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

/* ——— Ссылка-заглушка маршрута ——— */

const route = document.querySelector(".js-route");
const routeHint = document.getElementById("route-hint");

route.addEventListener("click", (event) => {
  event.preventDefault();
  routeHint.hidden = false;
});

/* ——— Пульт: время и маркер — модель в минутах от 00:00 дня 1 ——— */

const START = 21 * 60;                 // 21:00 день 1
const SPAN = 32 * 60;                  // до 05:00 день 3 — «сутки с хвостом»
const STOPS = [21 * 60, 34 * 60, 35 * 60, 53 * 60]; // 21:00/10:00/11:00/05:00

function clockParts(min) {
  const day = Math.floor(min / 1440) + 1;
  const total = Math.round(min / 5) * 5; // шаг 5 минут — часы «тикают», не дрожат
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  return {
    time: String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"),
    day: "день " + day,
  };
}

const bench = document.querySelector(".bench");
const clockTime = document.getElementById("benchClockTime");
const clockDay = document.getElementById("benchClockDay");
const marker = document.querySelector(".bench-marker");
const milestones = gsapReady(".milestone");

function gsapReady(selector) {
  return document.querySelectorAll(selector);
}

function setBench(progress) {
  const min = START + progress * SPAN;
  const parts = clockParts(min);
  clockTime.textContent = parts.time;
  clockDay.textContent = parts.day;
  marker.style.top = progress * 100 + "%";
  // активная веха — ближайшая по времени
  let best = 0;
  STOPS.forEach((stop, i) => {
    if (Math.abs(min - stop) < Math.abs(min - STOPS[best])) best = i;
  });
  milestones.forEach((m, i) => {
    m.classList.toggle("is-active", i === best);
    m.classList.toggle("is-dimmed", i !== best);
  });
}

/* ——— Анимации ——— */

if (hasGsap && !prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Reveal текста — toggle: играет при входе, откатывается при уходе назад
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Карточки меню — одна группа со stagger
  gsap.from(".menu-card", {
    opacity: 0,
    y: 24,
    duration: 0.7,
    stagger: 0.08,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".menu-strip",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  // 2. Параллакс фото — scrub, ±12px
  gsap.utils.toArray(".parallax").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 14 },
      {
        y: -14,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  // 3. Выход за сетку — scrub: блок доезжает из «внутри» в «навылет»
  gsap.fromTo(
    ".spread-figure",
    { y: 90 },
    {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: "#craft",
        start: "top 70%",
        end: "bottom 55%",
        scrub: true,
      },
    }
  );
  gsap.fromTo(
    ".baker-grid",
    { y: 90 },
    {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: "#baker",
        start: "top 75%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  // 4. Пульт — scrub: часы, маркер, подсветка активной вехи
  setBench(0);
  ScrollTrigger.create({
    trigger: bench,
    start: "top 70%",
    end: "bottom 45%",
    scrub: true,
    onUpdate: (self) => setBench(self.progress),
  });
} else {
  // Reduced motion или нет GSAP: статичный кадр — главы полностью читаемы
  if (bench) {
    clockTime.textContent = "21:00 → 05:00";
    clockDay.textContent = "день 1 → день 3";
    milestones.forEach((m) => m.classList.add("is-active"));
  }
}
