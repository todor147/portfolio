/**
 * CV variants — tailored views of the same career, generated from the
 * content collections. The general view mirrors the designed PDF; the
 * focused views (software, wine, customer service) pull only the relevant
 * roles, certifications and skills.
 */
import { byMostRecent, diffMonths, formatRange, isExpired } from "./dates";

/**
 * Downloadable PDF per variant id (served from /public/assets). Generated from
 * the /cv/<id>/ pages by `npm run cv:pdf` (scripts/generate-cv-pdfs.mjs) —
 * keep ids and filenames in sync with that script.
 */
export const CV_PDFS: Record<string, string> = {
  general: "/assets/Todor_Aleksandrov_CV_General.pdf",
  software: "/assets/Todor_Aleksandrov_CV_Software.pdf",
  wine: "/assets/Todor_Aleksandrov_CV_Wine.pdf",
  "customer-service": "/assets/Todor_Aleksandrov_CV_Customer_Service.pdf",
};

/** The general CV PDF (kept for compatibility). */
export const GENERAL_PDF = CV_PDFS.general;

export const CONTACT = {
  name: "Todor Aleksandrov",
  location: "Limerick, Ireland",
  email: "todor_147@abv.bg",
  phone: "+353 89 469 4333",
  phoneHref: "tel:+353894694333",
  site: "todors-portfolio.netlify.app",
  siteHref: "https://todors-portfolio.netlify.app",
  linkedin: "linkedin.com/in/todoraleksandrov",
  linkedinHref: "https://www.linkedin.com/in/todoraleksandrov/",
  github: "github.com/todor147",
  githubHref: "https://github.com/todor147",
  languages: "English — bilingual (C2) · Bulgarian — native",
};

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface CvVariant {
  id: string;
  /** Short label for nav / cards. */
  label: string;
  /** Headline shown under the name on the CV. */
  headline: string;
  /** One-line description for the hub card. */
  blurb: string;
  /** Profile paragraph at the top of the CV. */
  profile: string;
  experienceCategories: string[];
  /** Force-include these experience slugs regardless of category. */
  experienceIncludeSlugs?: string[];
  /** Drop these experience slugs even if their category matches. */
  experienceExcludeSlugs?: string[];
  certCategories: string[];
  certIncludeSlugs?: string[];
  showProjects: boolean;
  showVolunteering: boolean;
  showAchievements: boolean;
  skills: SkillGroup[];
}

const TECHNICAL_SKILLS: SkillGroup[] = [
  {
    group: "Languages & web",
    items: ["JavaScript", "TypeScript", "PHP", "Java", "HTML5", "CSS3", "Astro", "Tailwind CSS", "Bootstrap"],
  },
  {
    group: "Testing & DevOps",
    items: ["Cypress", "Fiddler", "Azure DevOps", "CI/CD", "Automated testing"],
  },
  {
    group: "Data & tools",
    items: ["MySQL", "TiDB Cloud", "Git & GitHub", "Docker", "SolidWorks (CAD)", "AI-assisted development"],
  },
];

export const cvVariants: CvVariant[] = [
  {
    id: "general",
    label: "General",
    headline: "Junior Software Engineer",
    blurb: "The complete picture — software, hospitality, language and aquatics in one document.",
    profile:
      "BSc Computer Science graduate (University of Limerick, 2026), now a Junior Software Engineer at VMotion IT Solutions while studying MSc AI & Machine Learning at UL. Two years of hands-on software experience at AMCS Group before that, spanning test automation, CI/CD, and release management on a large enterprise platform. I build full-stack web applications end to end, and complement that with first-line IT support, high-end hospitality, lifeguarding, and Bulgarian–English interpreting. Comfortable shipping code, leading on the ground, and communicating clearly with people from every background.",
    experienceCategories: ["software", "hospitality", "education", "lifeguarding", "interpretation", "delivery", "other"],
    certCategories: ["tech", "hospitality", "safety", "language", "other"],
    showProjects: true,
    showVolunteering: true,
    showAchievements: true,
    skills: TECHNICAL_SKILLS,
  },
  {
    id: "software",
    label: "Software",
    headline: "Junior Software Engineer",
    blurb: "Focused on engineering — VMotion IT Solutions, AMCS Platform work, full-stack projects and the technical stack.",
    profile:
      "BSc Computer Science graduate (University of Limerick, 2026), now a Junior Software Engineer at VMotion IT Solutions (an Atlassian Gold Solution Partner) while studying MSc AI & Machine Learning at UL. Two years of hands-on software experience at AMCS Group before that — test automation with Cypress and Fiddler, CI/CD on Azure DevOps, and release management across a large enterprise platform. I build and ship full-stack web applications end to end, from a solo re-engineered coaching marketplace to this portfolio.",
    experienceCategories: ["software"],
    experienceIncludeSlugs: ["ul-ict-tutor-2026", "ul-ict-tutor-2025-26", "ul-ict-tutor-2025", "ul-pslg-tutor"],
    certCategories: ["tech", "language"],
    showProjects: true,
    showVolunteering: false,
    showAchievements: false,
    skills: TECHNICAL_SKILLS,
  },
  {
    id: "wine",
    label: "Wine & Hospitality",
    headline: "Junior Sommelier · Food & Beverage",
    blurb: "Sommelier and fine-dining service at Adare Manor, with WSET and Court of Master Sommeliers credentials.",
    profile:
      "Former Junior Sommelier at Adare Manor (2024–2026) — Ireland's five-star Forbes-rated estate — holding WSET Level 2 (Merit) and the Court of Master Sommeliers Introductory certification. Deep knowledge of an extensive wine list, crafting food pairings and bespoke event selections, consistently lifting wine spend through attentive, knowledgeable service for an international clientele.",
    experienceCategories: ["hospitality"],
    certCategories: ["hospitality"],
    showProjects: false,
    showVolunteering: false,
    showAchievements: false,
    skills: [
      {
        group: "Wine & service",
        items: ["Wine list mastery", "Food & wine pairing", "Event wine planning", "Upselling", "Cellar & inventory knowledge"],
      },
      {
        group: "Front of house",
        items: ["Fine-dining service", "VIP & international guests", "Menu advisory", "Kitchen coordination"],
      },
    ],
  },
  {
    id: "customer-service",
    label: "Customer Service",
    headline: "Customer Service & Front-line Support",
    blurb: "Front-line, people-first work across hospitality, IT support, library service and interpreting.",
    profile:
      "People-first professional with experience across five-star hospitality, first-line IT support, library front-desk service, tutoring, and Bulgarian–English interpreting. I stay calm under pressure, communicate clearly with people from every background, and see issues through to resolution — whether that's a guest at Adare Manor, a staff member locked out of their account, or a patient who needs an interpreter.",
    experienceCategories: ["hospitality", "interpretation", "delivery", "education"],
    // Duty Manager roles are front-line, customer-facing management (their
    // lifeguarding category would otherwise exclude them).
    experienceIncludeSlugs: [
      "ul-itd-computing-assistant",
      "aura-grove-island-duty-manager",
      "askeaton-duty-manager",
    ],
    certCategories: ["language"],
    certIncludeSlugs: ["customer-service-payments", "cms-introductory-sommelier"],
    showProjects: false,
    showVolunteering: false,
    showAchievements: false,
    skills: [
      {
        group: "Service & support",
        items: ["First-line IT support", "Account management (MFA / password resets)", "Front-of-house service", "Complaint & conflict resolution", "Incident handling"],
      },
      {
        group: "Communication",
        items: ["Bilingual interpreting (EN/BG)", "Tutoring & onboarding", "Clear written & verbal communication", "Supporting non-technical users"],
      },
    ],
  },
];

export function getVariant(id: string): CvVariant | undefined {
  return cvVariants.find((v) => v.id === id);
}

// ───────────────── Experience selection ─────────────────

interface ExpData {
  title: string;
  employer: string;
  employerUrl?: string;
  location?: string;
  category: string;
  start: string;
  end?: string;
  current?: boolean;
  summary: string;
}
interface ExpEntry {
  id: string;
  data: ExpData;
}

/** One continuous stint within a (possibly merged) role. */
export interface CvPeriod {
  start: string;
  end?: string;
  current: boolean;
}

/** Like formatRange, but a range whose start equals its end renders once ("Mar 2023"). */
export function formatCvRange(start: string, end?: string, current?: boolean): string {
  if (!current && end === start) return formatRange(start);
  return formatRange(start, end, current);
}

/** Renders periods as "May 2025 – Sep 2025 · Jun 2026 – Present". */
export function formatPeriods(periods: CvPeriod[]): string {
  return periods.map((p) => formatCvRange(p.start, p.end, p.current)).join(" · ");
}

export interface CvRole {
  title: string;
  employer: string;
  employerUrl?: string;
  location?: string;
  start: string;
  end?: string;
  current: boolean;
  /** Actual stints, joined only when contiguous (gap of one month or less). */
  periods: CvPeriod[];
  summary: string;
  category: string;
}

/** Sort stints and join those that overlap or are at most one empty month apart. */
function mergePeriods(input: CvPeriod[]): CvPeriod[] {
  const sorted = [...input].sort((a, b) => a.start.localeCompare(b.start));
  const out: CvPeriod[] = [];
  for (const p of sorted) {
    const last = out.at(-1);
    // diffMonths is inclusive: Sep -> Oct = 2, Sep -> Nov = 3 (one empty month).
    if (last && last.end && diffMonths(last.end, p.start) <= 3) {
      if (p.current || !p.end) {
        last.end = p.end;
        last.current = p.current;
      } else if (p.end > last.end) {
        last.end = p.end;
      }
    } else {
      out.push({ ...p });
    }
  }
  return out;
}

/**
 * Filter experience by the variant, then merge repeated stints of the same
 * role (e.g. three Peer Advisor terms) into a single entry — so each role
 * appears once on the CV — while keeping the real periods (contiguous stints
 * are joined, separate ones are listed individually).
 */
export function selectExperience(entries: ExpEntry[], v: CvVariant): CvRole[] {
  const cats = new Set(v.experienceCategories);
  const include = new Set(v.experienceIncludeSlugs ?? []);
  const exclude = new Set(v.experienceExcludeSlugs ?? []);

  const picked = entries.filter(
    (e) => !exclude.has(e.id) && (cats.has(e.data.category) || include.has(e.id)),
  );

  const byKey = new Map<string, ExpEntry[]>();
  for (const e of picked) {
    const key = `${e.data.employer}||${e.data.title}`;
    const group = byKey.get(key);
    if (group) group.push(e);
    else byKey.set(key, [e]);
  }

  const roles: CvRole[] = [];
  for (const group of byKey.values()) {
    const starts = group.map((g) => g.data.start).sort();
    const ends = group.map((g) => g.data.end).filter((x): x is string => Boolean(x)).sort();
    const current = group.some((g) => g.data.current);
    const latest = [...group].sort((a, b) => byMostRecent(a.data, b.data))[0];
    const periods = mergePeriods(
      group.map((g) => ({
        start: g.data.start,
        end: g.data.current ? undefined : (g.data.end ?? g.data.start),
        current: Boolean(g.data.current),
      })),
    );
    roles.push({
      title: latest.data.title,
      employer: latest.data.employer,
      employerUrl: latest.data.employerUrl,
      location: latest.data.location,
      start: starts[0],
      end: current ? undefined : ends.at(-1),
      current,
      periods,
      summary: latest.data.summary,
      category: latest.data.category,
    });
  }

  // Current roles first; among those, software leads (it's the CV headline).
  return roles.sort((a, b) => {
    if (a.current && b.current && (a.category === "software") !== (b.category === "software")) {
      return a.category === "software" ? -1 : 1;
    }
    return byMostRecent(a, b);
  });
}

// ───────────────── Certification selection ─────────────────

interface CertData {
  title: string;
  issuer: string;
  issued: string;
  expires?: string;
  category: string;
}
interface CertEntry {
  id: string;
  data: CertData;
}

export function selectCerts<T extends CertEntry>(entries: T[], v: CvVariant): T[] {
  const cats = new Set(v.certCategories);
  const include = new Set(v.certIncludeSlugs ?? []);
  return entries
    .filter((e) => cats.has(e.data.category) || include.has(e.id))
    .filter((e) => !isExpired(e.data.expires))
    .sort((a, b) => b.data.issued.localeCompare(a.data.issued));
}
