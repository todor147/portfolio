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

export const styleConfig: Record<Style, { label: string; color: string }> = {
  red:       { label: "Red",       color: "#9f1239" },
  white:     { label: "White",     color: "#b45309" },
  rosé:      { label: "Rosé",      color: "#db2777" },
  orange:    { label: "Orange",    color: "#c2410c" },
  sweet:     { label: "Sweet",     color: "#a16207" },
  sparkling: { label: "Sparkling", color: "#0369a1" },
  spirit:    { label: "Spirit",    color: "#78350f" },
};

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
