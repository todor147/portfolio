/** Konami easter egg overlay. Loaded lazily via dynamic import() from enhancements.ts. */

export function triggerKonami() {
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

  const previouslyFocused = document.activeElement as HTMLElement | null;
  const overlay = document.createElement("dialog");
  overlay.id = "konami-overlay";
  overlay.setAttribute("aria-label", "Hidden wine recommendation");
  overlay.innerHTML = `
    <div class="konami-card">
      <button type="button" class="konami-close" aria-label="Close">×</button>
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
      width: 100%; height: 100%; max-width: none; max-height: none;
      margin: 0; border: 0; background: transparent; color: inherit;
      overflow: auto; padding: 1rem;
    }
    #konami-overlay[open] { display: grid; place-items: center; }
    #konami-overlay::backdrop {
      background: rgba(26,22,20,0.85); backdrop-filter: blur(6px);
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
    if (overlay.open) overlay.close();
  }
  // Native <dialog> handles Escape; clean up whenever it closes.
  overlay.addEventListener("close", () => {
    overlay.remove();
    styles.remove();
    previouslyFocused?.focus?.();
  });
  const closeBtn = overlay.querySelector<HTMLButtonElement>(".konami-close");
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.showModal();
  closeBtn?.focus();
}
