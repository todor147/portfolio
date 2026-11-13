/**
 * Shared experience helpers: category labels/order and month-index maths on
 * "YYYY-MM" strings. A month index counts months since year 0 (year * 12 + month - 1),
 * so ranges and concurrency can be computed with plain integers.
 */

export const categoryLabels: Record<string, string> = {
  software: "Software",
  hospitality: "Hospitality",
  education: "Education",
  lifeguarding: "Lifeguarding",
  interpretation: "Languages",
  delivery: "Delivery",
  other: "Other",
};

/** Fixed display order for the timeline. Colour follows the category, never its rank. */
export const categoryOrder = [
  "software",
  "education",
  "hospitality",
  "lifeguarding",
  "other",
  "interpretation",
  "delivery",
] as const;

/** "YYYY-MM" -> month index. */
export function monthIndex(yyyymm: string): number {
  const [y, m] = yyyymm.split("-");
  return Number(y) * 12 + (Number(m) - 1);
}

/** Month index -> "YYYY-MM". */
export function indexToYm(index: number): string {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** The current month as "YYYY-MM" (evaluated at build time on a static site). */
export function currentYm(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Fractional month position of "now": the current month index plus how far through it we are. */
export function todayPosition(now: Date = new Date()): number {
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return monthIndex(currentYm(now)) + (now.getDate() - 0.5) / daysInMonth;
}

/** Group key on the timeline: the optional `workplace`, else the employer. */
export function workplaceKey(d: { workplace?: string; employer: string }): string {
  return d.workplace ?? d.employer;
}

/** Group display name: `workplace`, else the short employer name, else the employer. */
export function workplaceName(d: {
  workplace?: string;
  employerShort?: string;
  employer: string;
}): string {
  return d.workplace ?? d.employerShort ?? d.employer;
}

/** "Limerick, Ireland" -> "Limerick"; "Dublin, Ireland (remote)" -> "Dublin (remote)". Other values pass through. */
export function placeLocation(location?: string): string {
  return (location ?? "").replace(", Ireland", "").trim();
}

/**
 * Department shown after a role title when a workplace has several employers (University of Limerick).
 * Takes the short employer name, drops a leading "UL ", and returns "" when nothing useful is left
 * (just "UL", or the same as the workplace name).
 */
export function departmentLabel(shortEmployer: string, groupName: string): string {
  const dept = shortEmployer.replace(/^UL /, "");
  return dept === "UL" || dept === groupName ? "" : dept;
}
