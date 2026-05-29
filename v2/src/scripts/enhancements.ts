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
        triggerKonami();
        pos = 0;
      }
    } else {
      pos = key === sequence[0] ? 1 : 0;
    }
  });
}

function triggerKonami() {
  // Avoid double-triggering
  if (document.getElementById("konami-overlay")) return;

  const wines = [
    { dish: "Anything", wine: "Champagne", reason: "It's never the wrong answer." },
    { dish: "A long day", wine: "Volnay Premier Cru", reason: "Soft Burgundian Pinot. Like a hug." },
    { dish: "Celebration", wine: "Pol Roger Brut Réserve", reason: "Churchill's choice. Stick with the classics." },
    { dish: "A quiet evening", wine: "Mâcon-Villages", reason: "Lightly oaked, unfussy, honest." },
    { dish: "Hard problem", wine: "Barolo, 10 years aged", reason: "Patience over force." },
  ];
  const pick = wines[Math.floor(Math.random() * wines.length)];

  const overlay = document.createElement("div");
  overlay.id = "konami-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Hidden wine recommendation");
  overlay.innerHTML = `
    <div class="konami-card">
      <button class="konami-close" aria-label="Close">×</button>
      <p class="konami-eyebrow">A hidden pour</p>
      <p class="konami-headline">
        ↑↑↓↓←→←→<span style="color:var(--accent)">BA</span>
      </p>
      <p class="konami-line">For <em>${pick.dish}</em>, try:</p>
      <h3 class="konami-wine">${pick.wine}</h3>
      <p class="konami-reason">${pick.reason}</p>
      <p class="konami-foot">— A small reward for the curious.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const styles = document.createElement("style");
  styles.textContent = `
    #konami-overlay {
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(26,22,20,0.85); backdrop-filter: blur(6px);
      display: grid; place-items: center; padding: 1rem;
      animation: konami-fade 200ms ease-out;
    }
    @keyframes konami-fade { from { opacity: 0; } to { opacity: 1; } }
    .konami-card {
      position: relative; max-width: 32rem; width: 100%;
      background: var(--bg); color: var(--text);
      border: 1px solid color-mix(in oklab, var(--text) 12%, transparent);
      border-radius: 1.5rem; padding: 2.5rem 2rem;
      animation: konami-pop 300ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    @keyframes konami-pop {
      from { transform: translateY(16px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .konami-close {
      position: absolute; top: 0.75rem; right: 0.75rem;
      width: 2rem; height: 2rem; border-radius: 9999px;
      border: 0; cursor: pointer; background: transparent;
      font-size: 1.5rem; line-height: 1;
      color: var(--text-soft);
    }
    .konami-close:hover { background: color-mix(in oklab, var(--text) 8%, transparent); }
    .konami-eyebrow {
      font-size: 0.7rem; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--accent);
      font-weight: 500;
    }
    .konami-headline {
      font-family: ui-monospace, monospace; font-size: 1.5rem;
      margin: 1rem 0; letter-spacing: 0.05em;
    }
    .konami-line {
      font-size: 0.95rem; color: var(--text-soft); margin-top: 1rem;
    }
    .konami-wine {
      font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 2.5rem);
      letter-spacing: -0.02em; line-height: 1.1;
      color: var(--accent); margin-top: 0.25rem;
    }
    .konami-reason {
      margin-top: 0.75rem; font-size: 1rem; line-height: 1.5;
      color: var(--text);
    }
    .konami-foot {
      margin-top: 1.5rem; font-size: 0.75rem;
      color: var(--text-soft); font-style: italic;
    }
  `;
  document.head.appendChild(styles);

  function close() {
    overlay.remove();
    styles.remove();
    document.removeEventListener("keydown", escClose);
  }
  function escClose(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
  overlay.querySelector(".konami-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", escClose);
}

/* ───────────────── Reading time ───────────────── */

function initReadingTime() {
  const targets = document.querySelectorAll<HTMLElement>("[data-reading-time]");
  targets.forEach((target) => {
    const scope = target.dataset.readingTime
      ? document.querySelector(target.dataset.readingTime)
      : target.closest("main");
    if (!scope) return;
    const text = (scope as HTMLElement).innerText ?? "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 220));
    target.textContent = `${minutes} min read`;
  });
}

/* ───────────────── Boot ───────────────── */

function boot() {
  initScrollReveals();
  initMagneticButtons();
  initSmoothAnchors();
  initCountUp();
  initKonami();
  initReadingTime();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
