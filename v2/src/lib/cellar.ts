/**
 * Shared display config for the cellar collection — used by both the
 * grid (src/pages/cellar.astro) and the detail page (src/pages/cellar/[...slug].astro).
 */

export type Style = "red" | "white" | "rosé" | "orange" | "sweet" | "sparkling" | "spirit";
export type Location =
  | "bulgaria"
  | "france"
  | "spain"
  | "ireland"
  | "portugal"
  | "austria"
  | "italy"
  | "hungary";

/**
 * `color` is the light-theme text colour (>= 4.5:1 on #FAF6F0). For theme-aware
 * colour use `styleColorVar(style)` together with `styleColorCss`, which defines
 * --style-<key> for both themes (dark values >= 4.5:1 on #2A2520).
 */
export const styleConfig: Record<Style, { label: string; color: string }> = {
  red:       { label: "Red",       color: "#9f1239" },
  white:     { label: "White",     color: "#8a4a07" },
  rosé:      { label: "Rosé",      color: "#be185d" },
  orange:    { label: "Orange",    color: "#b23a0a" },
  sweet:     { label: "Sweet",     color: "#8a5a00" },
  sparkling: { label: "Sparkling", color: "#0369a1" },
  spirit:    { label: "Spirit",    color: "#78350f" },
};

/** Dark-theme counterparts of styleConfig colours. */
export const styleColorDark: Record<Style, string> = {
  red:       "#fb7185",
  white:     "#e8a64f",
  rosé:      "#f472b6",
  orange:    "#fb923c",
  sweet:     "#e0b030",
  sparkling: "#38bdf8",
  spirit:    "#d9a066",
};

/** CSS custom property name for a style's theme-aware colour. */
export const styleVarName = (style: Style): string => `--style-${style === "rosé" ? "rose" : style}`;

/** `var(--style-x, <light hex>)` for use in inline styles. */
export const styleColorVar = (style: Style): string =>
  `var(${styleVarName(style)}, ${styleConfig[style].color})`;

/** Stylesheet text defining --style-* in light and dark themes. */
export const styleColorCss: string = (() => {
  const keys = Object.keys(styleConfig) as Style[];
  const light = keys.map((k) => `${styleVarName(k)}:${styleConfig[k].color};`).join("");
  const dark = keys.map((k) => `${styleVarName(k)}:${styleColorDark[k]};`).join("");
  return `:root{${light}}:root.dark{${dark}}`;
})();

export const locationConfig: Record<Location, string> = {
  bulgaria: "Bulgaria",
  france:   "France",
  spain:    "Spain",
  ireland:  "Ireland",
  portugal: "Portugal",
  austria:  "Austria",
  italy:    "Italy",
  hungary:  "Hungary",
};

/**
 * Filename (under public/assets/cellar-og/ and public/assets/cellar-hero/)
 * for each style's representative photo. Keyed separately from Style since
 * "rosé" isn't a safe bare filename.
 */
export const styleImageFile: Record<Style, string> = {
  red: "red.jpg",
  white: "white.jpg",
  "rosé": "rose.jpg",
  orange: "orange.jpg",
  sweet: "sweet.jpg",
  sparkling: "sparkling.jpg",
  spirit: "spirit.jpg",
};

/** Whether the hero photo should fill the banner (cover) or sit inset on
 * its own background (contain) — the whisky pour shot has a white backdrop
 * that looks best contained rather than cropped edge-to-edge. */
export const styleImageFit: Record<Style, "cover" | "contain"> = {
  red: "cover",
  white: "cover",
  "rosé": "cover",
  orange: "cover",
  sweet: "cover",
  sparkling: "cover",
  spirit: "contain",
};
