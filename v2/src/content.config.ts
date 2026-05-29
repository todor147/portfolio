import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    title: z.string(),
    employer: z.string(),
    employerUrl: z.string().url().optional(),
    location: z.string().optional(),
    category: z.enum([
      "software",
      "hospitality",
      "education",
      "lifeguarding",
      "interpretation",
      "delivery",
      "other",
    ]),
    start: z.string(), // YYYY-MM
    end: z.string().optional(), // YYYY-MM, omit for current
    current: z.boolean().default(false),
    summary: z.string(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/certifications" }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    issuerUrl: z.string().url().optional(),
    issued: z.string(), // YYYY-MM
    expires: z.string().optional(),
    credentialId: z.string().optional(),
    category: z.enum(["tech", "hospitality", "safety", "language", "other"]),
    icon: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    problem: z.string().optional(),
    approach: z.string().optional(),
    contribution: z.string().optional(),
    learnings: z.string().optional(),
  }),
});

const volunteering = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/volunteering" }),
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    organizationUrl: z.string().url().optional(),
    start: z.string(),
    end: z.string().optional(),
    summary: z.string(),
  }),
});

const achievements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/achievements" }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    issuerUrl: z.string().url().optional(),
    awarded: z.string(),
    summary: z.string(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/education" }),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    institutionUrl: z.string().url().optional(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string().optional(),
    grade: z.string().optional(),
    activities: z.string().optional(),
    note: z.string().optional(),
    status: z.enum(["completed", "current", "upcoming"]).default("completed"),
    order: z.number().default(100),
  }),
});

const pairings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pairings" }),
  schema: z.object({
    dish: z.string(),
    cuisine: z.string().optional(),
    wine: z.string(),
    grape: z.string(),
    region: z.string().optional(),
    example: z.string().optional(),
    rationale: z.string(),
  }),
});

const scenarios = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/scenarios" }),
  schema: z.object({
    title: z.string(),
    severity: z.enum(["critical", "urgent", "serious"]),
    setting: z.string().default("any"),
    danger: z.string(),
    response: z.array(z.string()),
    skills: z.array(z.string()),
    emergency_number: z.string().default("999 / 112"),
    callout: z.string().optional(),
  }),
});

const phrases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/phrases" }),
  schema: z.object({
    english: z.string(),
    bulgarian: z.string(),
    cyrillic: z.string(),
    pronunciation: z.string(),
    category: z.enum([
      "greetings",
      "restaurant",
      "directions",
      "emergency",
      "everyday",
      "sommelier",
    ]),
    note: z.string().optional(),
  }),
});

export const collections = {
  experience,
  certifications,
  projects,
  volunteering,
  achievements,
  education,
  pairings,
  scenarios,
  phrases,
};
