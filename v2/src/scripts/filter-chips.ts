/**
 * Shared single-select chip group: toggles `.active` + aria-pressed, applies
 * optional inline styles for the active/inactive state, and reports changes.
 */

export type ChipStyle = Record<string, string>;

export interface ChipGroupOptions {
  /** Inline styles (CSS property -> value) applied to the active chip. */
  activeStyle?: ChipStyle;
  /** Inline styles applied to every inactive chip. */
  inactiveStyle?: ChipStyle;
  /** Called after a chip is selected by the user. */
  onChange?: (btn: HTMLButtonElement) => void;
}

export interface ChipGroup {
  /** Mark `btn` as the active chip (does not call onChange). */
  select: (btn: HTMLButtonElement) => void;
}

function applyStyle(btn: HTMLElement, style?: ChipStyle) {
  if (!style) return;
  for (const [prop, value] of Object.entries(style)) btn.style.setProperty(prop, value);
}

export function initChipGroup(
  buttons: Iterable<HTMLButtonElement>,
  { activeStyle, inactiveStyle, onChange }: ChipGroupOptions = {},
): ChipGroup {
  const list = Array.from(buttons);

  function select(active: HTMLButtonElement) {
    for (const btn of list) {
      const isActive = btn === active;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
      applyStyle(btn, isActive ? activeStyle : inactiveStyle);
    }
  }

  for (const btn of list) {
    btn.addEventListener("click", () => {
      select(btn);
      onChange?.(btn);
    });
  }

  return { select };
}
