/**
 * Date utilities for "YYYY-MM" format strings used across content collections.
 */

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_NAMES_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function parse(yyyymm: string): { year: number; month: number } {
  const [yearStr, monthStr] = yyyymm.split("-");
  return { year: Number(yearStr), month: Number(monthStr) };
}

export function formatMonthYear(yyyymm: string, long = false): string {
  const { year, month } = parse(yyyymm);
  const months = long ? MONTH_NAMES_LONG : MONTH_NAMES;
  return `${months[month - 1]} ${year}`;
}

export function formatRange(
  start: string,
  end?: string,
  current?: boolean,
  options: { separator?: string; long?: boolean } = {},
): string {
  const { separator = " – ", long = false } = options;
  const startStr = formatMonthYear(start, long);
  if (current) return `${startStr}${separator}Present`;
  if (!end) return startStr;
  return `${startStr}${separator}${formatMonthYear(end, long)}`;
}

/** Returns difference between two YYYY-MM strings in months (end - start, inclusive). */
export function diffMonths(start: string, end: string): number {
  const s = parse(start);
  const e = parse(end);
  return (e.year - s.year) * 12 + (e.month - s.month) + 1;
}

/** Formats a duration in months as "Xy Ym" or "Xm". */
export function formatDuration(months: number): string {
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (remainder === 0) return `${years}yr`;
  return `${years}yr ${remainder}mo`;
}

/** Sort comparator: most-recent start first. Current roles win. */
export function byMostRecent(
  a: { start: string; current?: boolean },
  b: { start: string; current?: boolean },
): number {
  if (a.current && !b.current) return -1;
  if (b.current && !a.current) return 1;
  return b.start.localeCompare(a.start);
}
