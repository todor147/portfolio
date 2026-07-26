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
