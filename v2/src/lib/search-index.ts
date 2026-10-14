/**
 * Search index for the command palette. Built at build time and served as
 * the static /search-index.json so it is fetched once on first palette open
 * instead of being inlined into every page.
 */
import { getCollection } from "astro:content";
import { cvVariants, CV_PDFS } from "./cv";
import { MAILTO, ROUTES, SEARCH_PAGES_AFTER_CV, SEARCH_PAGES_BEFORE_CV, SITE, type Route, type RouteKey } from "./site";

export interface SearchItem {
  /** Group heading, e.g. "Page", "Role". */
  group: string;
  /** Primary label. */
  title: string;
  /** Secondary line. */
  note?: string;
  href: string;
  /** Lower-cased haystack used for matching. */
  key: string;
}

function item(group: string, title: string, note: string | undefined, href: string, ...extra: (string | undefined)[]): SearchItem {
  return {
    group,
    title,
    ...(note ? { note } : {}),
    href,
    key: [title, note, ...extra].filter(Boolean).join(" ").toLowerCase(),
  };
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [experience, certifications, projects, pairings, scenarios, phrases, education, cellar] =
    await Promise.all([
      getCollection("experience"),
      getCollection("certifications"),
      getCollection("projects"),
      getCollection("pairings"),
      getCollection("scenarios"),
      getCollection("phrases"),
      getCollection("education"),
      getCollection("cellar"),
    ]);

  const items: SearchItem[] = [];

  // Top-level pages
  const catCount = new Set(certifications.map((c) => c.data.category)).size;
  const pageItem = (key: RouteKey, note?: string) => {
    const r: Route = ROUTES[key];
    return item("Page", r.search?.title ?? r.label, note ?? r.search?.note, r.href, r.search?.extra);
  };
  items.push(
    ...SEARCH_PAGES_BEFORE_CV.map((k) => pageItem(k)),
    pageItem("certifications", `${certifications.length} certs in ${catCount} categories`),
    pageItem("cv"),
    ...cvVariants.map((v) =>
      item("Page", `CV: ${v.label}`, v.blurb, `/cv/${v.id}/`, "cv resume résumé"),
    ),
    ...SEARCH_PAGES_AFTER_CV.map((k) => pageItem(k)),
  );

  // Downloads and external links
  items.push(
    ...cvVariants.map((v) =>
      item("Link", `Download CV (PDF): ${v.label}`, `${v.headline}, PDF`, CV_PDFS[v.id], `cv resume résumé pdf download ${v.id.replace("-", " ")} ${v.label.toLowerCase()}`),
    ),
    item("Link", SITE.linkedin.label, SITE.linkedin.handle, SITE.linkedin.url),
    item("Link", SITE.github.label, SITE.github.handle, SITE.github.url),
    item("Link", "Email", SITE.email, MAILTO, "contact message"),
  );

  experience.forEach((e) =>
    items.push(
      item("Role", e.data.title, e.data.employer, `/experience/#${e.id}`, e.data.category, e.data.summary),
    ),
  );

  certifications.forEach((c) =>
    items.push(
      item("Certification", c.data.title, c.data.issuer, `/certifications/#cat-${c.data.category}`, c.data.category),
    ),
  );

  projects.forEach((p) =>
    items.push(
      item("Project", p.data.title, p.data.tagline, `/projects/${p.id}/`, p.data.stack.join(" "), p.data.tags.join(" ")),
    ),
  );

  // The about page has no per-school anchors, so link to the page itself.
  education.forEach((ed) =>
    items.push(item("Education", ed.data.institution, ed.data.degree, "/about/", ed.data.location)),
  );

  pairings.forEach((p) =>
    items.push(
      item("Pairing", p.data.dish, `→ ${p.data.wine}`, "/sommelier/#pairing-tool", p.data.grape, p.data.region),
    ),
  );

  cellar.forEach((b) =>
    items.push(
      item("Bottle", b.data.name, `${b.data.producer} · ${b.data.region}`, `/cellar/${b.id}/`, b.data.variety.join(" "), b.data.style),
    ),
  );

  scenarios.forEach((s) =>
    items.push(item("Scenario", s.data.title, s.data.severity, "/water/#scenarios-tool", s.data.skills.join(" "))),
  );

  phrases.forEach((p) =>
    items.push(
      item(
        "Phrase",
        p.data.english,
        `${p.data.cyrillic} · ${p.data.pronunciation}`,
        "/language/#phrase-finder",
        p.data.bulgarian,
        p.data.category,
      ),
    ),
  );

  return items;
}
