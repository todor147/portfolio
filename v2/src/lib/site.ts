/**
 * Single source of truth for site identity and the route registry.
 * Pure data, no framework imports, so astro.config.mjs and scripts can use it.
 * The phone number is deliberately NOT here: it lives only in lib/cv.ts so it
 * stays off web pages.
 */
export const SITE = {
  name: "Todor Aleksandrov",
  url: "https://todors-portfolio.netlify.app",
  host: "todors-portfolio.netlify.app",
  email: "todor_147@abv.bg",
  location: "Limerick, Ireland",
  linkedin: {
    url: "https://www.linkedin.com/in/todoraleksandrov/",
    label: "LinkedIn",
    handle: "todoraleksandrov",
    display: "linkedin.com/in/todoraleksandrov",
  },
  github: {
    url: "https://github.com/todor147",
    label: "GitHub",
    handle: "todor147",
    display: "github.com/todor147",
  },
  languages: "English — bilingual (C2) · Bulgarian — native",
} as const;

export const MAILTO = `mailto:${SITE.email}`;

export interface Route {
  /** Path with a trailing slash. */
  href: string;
  /** Short label used in the nav. */
  label: string;
  /** Secondary line in the nav "More" dropdown. */
  note?: string;
  /** Label override for the footer. */
  footerLabel?: string;
  /** Command-palette entry (title defaults to label). */
  search?: { title?: string; note: string; extra?: string };
  /** OG card slug and text; present only where a card is generated. */
  og?: { slug: string; title: string; description: string };
}

export const ROUTES = {
  home: {
    href: "/", label: "Home",
    search: { note: "The hero & featured" },
    og: { slug: "home", title: "Todor Aleksandrov", description: "Software Engineer · Sommelier · Lifeguard · Interpreter" },
  },
  about: {
    href: "/about/", label: "About",
    search: { note: "Bio + bento + education journey" },
    og: { slug: "about", title: "About", description: "The CS-meets-sommelier path" },
  },
  experience: {
    href: "/experience/", label: "Experience",
    search: { note: "Timeline of every role" },
    og: { slug: "experience", title: "Experience", description: "Software, hospitality, aquatics, and more" },
  },
  projects: {
    href: "/projects/", label: "Projects",
    search: { note: "Filterable project grid" },
    og: { slug: "projects", title: "Projects", description: "Full-stack web applications and side projects" },
  },
  cv: {
    href: "/cv/", label: "CV",
    search: { note: "Curriculum vitae, in four tailored versions", extra: "cv resume résumé curriculum vitae" },
    og: { slug: "cv", title: "CV", description: "General · Software · Wine & Hospitality · Customer Service" },
  },
  sommelier: {
    href: "/sommelier/", label: "Wine", footerLabel: "Wine — Sommelier",
    search: { title: "Wine — Sommelier", note: "33-dish pairing tool" },
    og: { slug: "sommelier", title: "Wine", description: "Junior Sommelier · WSET Level 2 Merit · CMS Introductory" },
  },
  water: {
    href: "/water/", label: "Water", footerLabel: "Water — Lifeguard",
    search: { title: "Water — Lifeguard", note: "Emergency-scenario tool" },
    og: { slug: "water", title: "Water", description: "Lifeguard · Duty Manager · PHECC FAR · Swim Ireland L2" },
  },
  language: {
    href: "/language/", label: "Language", footerLabel: "Language — Interpreter",
    search: { title: "Language — Interpreter", note: "Bulgarian phrasebook" },
    og: { slug: "language", title: "Language", description: "Bulgarian–English interpreter · EFSET C2 Proficient" },
  },
  certifications: {
    href: "/certifications/", label: "Certifications", note: "Qualifications across five areas",
    // search note is computed from the content collection
    search: { note: "", extra: "credentials courses" },
    og: { slug: "certifications", title: "Certifications", description: "WSET, PHECC, RLSS, Swim Ireland, and professional quals" },
  },
  gallery: {
    href: "/gallery/", label: "Gallery", note: "Photos from service, travel & sport",
    search: { note: "Photos, with a lightbox", extra: "photos images" },
    og: { slug: "gallery", title: "Gallery", description: "Photos from service, travel, and sport" },
  },
  cellar: {
    href: "/cellar/", label: "Cellar", note: "Personal wine and spirit inventory",
    search: { note: "Bottles I own and have tasted", extra: "wine bottles collection" },
    og: { slug: "cellar", title: "Cellar", description: "A personal inventory of wine and spirits" },
  },
  transcript: {
    href: "/transcript/", label: "Transcript", note: "Full BSc academic record",
    search: { note: "University grades & results", extra: "grades results marks degree university" },
    og: { slug: "transcript", title: "Academic Transcript", description: "BSc Computer Systems · UL · 2:1 Honours · QCA 3.06" },
  },
  now: {
    href: "/now/", label: "Now", note: "What I'm currently working on",
    search: { note: "What I'm doing this month" },
    og: { slug: "now", title: "Now", description: "What I'm working on, learning, and drinking this month" },
  },
  uses: {
    href: "/uses/", label: "Uses", note: "Tools, hardware, and daily carry",
    search: { note: "Tools & gear", extra: "setup hardware software" },
    og: { slug: "uses", title: "Uses", description: "Tools, hardware, wine kit, and what's in the cellar" },
  },
  contact: {
    href: "/contact/", label: "Contact",
    search: { note: "Send a message", extra: "email message hire" },
    og: { slug: "contact", title: "Get in touch", description: "Software roles, wine questions, or just to say hello" },
  },
} as const satisfies Record<string, Route>;

export type RouteKey = keyof typeof ROUTES;

/** Resolve an ordered list of route keys to routes. */
export const pick = (keys: readonly RouteKey[]): Route[] => keys.map((k) => ROUTES[k]);

/** Desktop nav: always-visible links, then the "More" dropdown. */
export const NAV = {
  primary: ["about", "experience", "projects", "cv", "sommelier", "water", "language"],
  more: ["certifications", "gallery", "cellar", "transcript", "now", "uses"],
} as const satisfies Record<string, readonly RouteKey[]>;

/** Footer link columns, in display order. */
export const FOOTER = {
  pages: ["about", "experience", "projects", "cv", "certifications", "transcript", "contact"],
  trades: ["sommelier", "water", "language"],
  explore: ["gallery", "cellar", "now", "uses"],
} as const satisfies Record<string, readonly RouteKey[]>;

/** Page entries in the command palette, in display order (certifications and cv sit between the two lists). */
export const SEARCH_PAGES_BEFORE_CV = [
  "home", "about", "experience", "projects",
] as const satisfies readonly RouteKey[];
export const SEARCH_PAGES_AFTER_CV = [
  "transcript", "cellar", "sommelier", "water", "language", "gallery", "now", "uses", "contact",
] as const satisfies readonly RouteKey[];

/** Suggestions on the 404 page (labels differ from nav on purpose). */
export const NOT_FOUND_LINKS = [
  { route: "home", label: "Home" },
  { route: "about", label: "About" },
  { route: "experience", label: "Experience" },
  { route: "projects", label: "Projects" },
  { route: "sommelier", label: "Sommelier" },
  { route: "contact", label: "Contact" },
] as const satisfies readonly { route: RouteKey; label: string }[];

/** OG cards for fixed pages, keyed by slug. */
export const OG_PAGES: Record<string, { title: string; description: string }> = Object.fromEntries(
  Object.values(ROUTES).flatMap((r) =>
    "og" in r ? [[r.og.slug, { title: r.og.title, description: r.og.description }]] : [],
  ),
);

export const KNOWN_OG_SLUGS = new Set(Object.keys(OG_PAGES));
