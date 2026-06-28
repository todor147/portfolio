/**
 * CV variants — tailored views of the same career, generated from the
 * content collections. The general view mirrors the designed PDF; the
 * focused views (software, wine, customer service) pull only the relevant
 * roles, certifications and skills.
 */
import { byMostRecent } from "./dates";

/** The designed, downloadable general CV (served from /public). */
export const GENERAL_PDF = "/assets/Todor_Aleksandrov_CV_General.pdf";

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
    headline: "Graduate Software Engineer",
    blurb: "The complete picture — software, hospitality, language and aquatics in one document.",
    profile:
      "BSc Computer Science graduate (University of Limerick, 2026), continuing to MSc AI & Machine Learning at UL from September 2026. Two years of hands-on software experience at AMCS Group spanning test automation, CI/CD, and release management on a large enterprise platform. I build full-stack web applications end to end, and complement that with first-line IT support, high-end hospitality, lifeguarding, and Bulgarian–English interpreting. Comfortable shipping code, leading on the ground, and communicating clearly with people from every background.",
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
    headline: "Graduate Software Engineer",
    blurb: "Focused on engineering — AMCS Platform work, full-stack projects and the technical stack.",
    profile:
      "BSc Computer Science graduate (University of Limerick, 2026), continuing to MSc AI & Machine Learning at UL from September 2026. Two years of hands-on software experience at AMCS Group — test automation with Cypress and Fiddler, CI/CD on Azure DevOps, and release management across a large enterprise platform. I build and ship full-stack web applications end to end, from a solo re-engineered coaching marketplace to this portfolio. Seeking a graduate software engineering role from 2027.",
    experienceCategories: ["software"],
    experienceIncludeSlugs: ["ul-ict-tutor-2025-26", "ul-pslg-tutor"],
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
      "Junior Sommelier at Adare Manor (2024–2026) — Ireland's five-star Forbes-rated estate — holding WSET Level 2 (Merit) and the Court of Master Sommeliers Introductory certification. Deep knowledge of an extensive wine list, crafting food pairings and bespoke event selections, consistently lifting wine spend through attentive, knowledgeable service for an international clientele.",
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
    experienceIncludeSlugs: ["ul-itd-computing-assistant"],
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

export interface CvRole {
  title: string;
  employer: string;
  employerUrl?: string;
  location?: string;
  start: string;
  end?: string;
  current: boolean;
  summary: string;
}

/**
 * Filter experience by the variant, then merge repeated stints of the same
 * role (e.g. three Peer Advisor terms) into a single entry spanning the full
 * range — so each role appears once on the CV.
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
    roles.push({
      title: latest.data.title,
      employer: latest.data.employer,
      employerUrl: latest.data.employerUrl,
      location: latest.data.location,
      start: starts[0],
      end: current ? undefined : ends.at(-1),
      current,
      summary: latest.data.summary,
    });
  }

  return roles.sort((a, b) => byMostRecent(a, b));
}

// ───────────────── Certification selection ─────────────────

interface CertData {
  title: string;
  issuer: string;
  issued: string;
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
    .sort((a, b) => b.data.issued.localeCompare(a.data.issued));
}
