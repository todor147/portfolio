/**
 * Site-wide enhancements that progressively layer on top of the page once
 * it's painted. All are guarded by prefers-reduced-motion and degrade
 * gracefully when JS is disabled.
 */

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isCoarsePointer = () =>
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ───────────────── Scroll-reveal ───────────────── */

function initScrollReveals() {
  if (prefersReducedMotion()) {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.classList.add("in-view");
    });
    return;
  }

  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.revealDelay
          ? Number(el.dataset.revealDelay)
          : 0;
        if (delay > 0) {
          el.style.transitionDelay = `${delay}ms`;
        }
        el.classList.add("in-view");
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((el) => observer.observe(el));
}

/* ───────────────── Magnetic CTAs ───────────────── */

function initMagneticButtons() {
  if (prefersReducedMotion() || isCoarsePointer()) return;

  const buttons = document.querySelectorAll<HTMLElement>("[data-magnetic]");

  buttons.forEach((btn) => {
    const STRENGTH = 0.18;
    const MAX = 10; // px cap

    function clamp(v: number) {
      return Math.max(-MAX, Math.min(MAX, v));
    }

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left - rect.width / 2) * STRENGTH);
      const y = clamp((e.clientY - rect.top - rect.height / 2) * STRENGTH);
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ───────────────── Smooth in-page anchor scrolling ───────────────── */

function initSmoothAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      // Update hash without page jump
      if (history.replaceState) history.replaceState(null, "", `#${id}`);
    });
  });
}

/* ───────────────── Animated counters ───────────────── */

function initCountUp() {
  if (prefersReducedMotion()) return;

  const counters = document.querySelectorAll<HTMLElement>("[data-count-up]");
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseFloat(el.dataset.countUp ?? el.textContent ?? "0");
        const decimals = (el.dataset.countDecimals ? Number(el.dataset.countDecimals) : 0);
        const duration = 1200;
        const start = performance.now();
        const initial = 0;

        function step(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          const value = initial + (target - initial) * eased;
          el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

/* ───────────────── Konami code easter egg ───────────────── */

function initKonami() {
  const sequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let pos = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        void import("./konami").then((m) => m.triggerKonami());
        pos = 0;
      }
    } else {
      pos = key === sequence[0] ? 1 : 0;
    }
  });
}

/* ───────────────── Boot ───────────────── */

function boot() {
  initScrollReveals();
  initMagneticButtons();
  initSmoothAnchors();
  initCountUp();
  initKonami();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
