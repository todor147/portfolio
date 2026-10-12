/**
 * Search index for the command palette. Built at build time and served as
 * the static /search-index.json so it is fetched once on first palette open
 * instead of being inlined into every page.
 */
import { getCollection } from "astro:content";
import { cvVariants, GENERAL_PDF } from "./cv";

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
  items.push(
    item("Page", "Home", "The hero & featured", "/"),
    item("Page", "About", "Bio + bento + education journey", "/about/"),
    item("Page", "Experience", "Timeline of every role", "/experience/"),
    item("Page", "Projects", "Filterable project grid", "/projects/"),
    item("Page", "Certifications", `${certifications.length} certs in ${catCount} categories`, "/certifications/", "credentials courses"),
    item("Page", "CV", "Curriculum vitae, in four tailored versions", "/cv/", "cv resume résumé curriculum vitae"),
    ...cvVariants.map((v) =>
      item("Page", `CV: ${v.label}`, v.blurb, `/cv/${v.id}/`, "cv resume résumé"),
    ),
    item("Page", "Transcript", "University grades & results", "/transcript/", "grades results marks degree university"),
    item("Page", "Cellar", "Bottles I own and have tasted", "/cellar/", "wine bottles collection"),
    item("Page", "Wine — Sommelier", "33-dish pairing tool", "/sommelier/"),
    item("Page", "Water — Lifeguard", "Emergency-scenario tool", "/water/"),
    item("Page", "Language — Interpreter", "Bulgarian phrasebook", "/language/"),
    item("Page", "Gallery", "Photos, with a lightbox", "/gallery/", "photos images"),
    item("Page", "Now", "What I'm doing this month", "/now/"),
    item("Page", "Uses", "Tools & gear", "/uses/", "setup hardware software"),
    item("Page", "Contact", "Send a message", "/contact/", "email message hire"),
  );

  // Downloads and external links
  items.push(
    item("Link", "Download CV (PDF)", "General CV, designed PDF", GENERAL_PDF, "cv resume résumé pdf download"),
    item("Link", "LinkedIn", "todoraleksandrov", "https://www.linkedin.com/in/todoraleksandrov/"),
    item("Link", "GitHub", "todor147", "https://github.com/todor147"),
    item("Link", "Email", "todor_147@abv.bg", "mailto:todor_147@abv.bg", "contact message"),
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
