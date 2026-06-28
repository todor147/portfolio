import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const inter = readFileSync(
  resolve("node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"),
);
const frauncesNormal = readFileSync(
  resolve("node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff"),
);
const frauncesItalic = readFileSync(
  resolve("node_modules/@fontsource/fraunces/files/fraunces-latin-700-italic.woff"),
);

type Page = { title: string; description: string };

const PAGES: Record<string, Page> = {
  home:           { title: "Todor Aleksandrov",    description: "Computer Science · Sommelier · Lifeguard · Interpreter" },
  about:          { title: "About",                description: "The CS-meets-sommelier path" },
  experience:     { title: "Experience",           description: "Software, hospitality, aquatics, and more" },
  projects:       { title: "Projects",             description: "Full-stack web applications and side projects" },
  cv:             { title: "CV",                   description: "General · Software · Wine & Hospitality · Customer Service" },
  contact:        { title: "Get in touch",         description: "Software roles, wine questions, or just to say hello" },
  sommelier:      { title: "Wine",                 description: "Junior Sommelier · WSET Level 2 Merit · CMS Introductory" },
  water:          { title: "Water",                description: "Lifeguard · Duty Manager · PHECC FAR · Swim Ireland L2" },
  language:       { title: "Language",             description: "Bulgarian–English interpreter · EFSET C2 Proficient" },
  certifications: { title: "Certifications",       description: "WSET, PHECC, RLSS, Swim Ireland, and professional quals" },
  transcript:     { title: "Academic Transcript",  description: "BSc Computer Systems · UL · 2:1 Honours · QCA 3.06" },
  now:            { title: "Now",                  description: "What I'm working on, learning, and drinking this month" },
  uses:           { title: "Uses",                 description: "Tools, hardware, wine kit, and what's in the cellar" },
  gallery:        { title: "Gallery",              description: "Photos from service, travel, and sport" },
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(PAGES).map(([slug, props]) => ({ params: { slug }, props }));

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as Page;

  const svg = await satori(ogTemplate(title, description), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter",     data: inter,          weight: 400, style: "normal" },
      { name: "Fraunces",  data: frauncesNormal, weight: 700, style: "normal" },
      { name: "Fraunces",  data: frauncesItalic, weight: 700, style: "italic" },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

function ogTemplate(title: string, description: string) {
  const fontSize = title.length > 22 ? 62 : title.length > 14 ? 72 : 84;

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#1A1614",
      },
      children: [
        // Burgundy left bar
        {
          type: "div",
          props: {
            style: { width: 10, height: "100%", background: "#7B1E2D", flexShrink: 0 },
          },
        },
        // Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 80px",
              flex: 1,
            },
            children: [
              // Top: URL
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "Inter",
                    fontSize: 17,
                    color: "rgba(250,246,240,0.38)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  },
                  children: "todors-portfolio.netlify.app",
                },
              },
              // Middle: title + description
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 20 },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "Fraunces",
                          fontSize,
                          fontWeight: 700,
                          color: "#FAF6F0",
                          lineHeight: 1.05,
                          letterSpacing: "-0.03em",
                        },
                        children: title,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "Inter",
                          fontSize: 24,
                          color: "rgba(250,246,240,0.58)",
                          lineHeight: 1.4,
                        },
                        children: description,
                      },
                    },
                  ],
                },
              },
              // Bottom: name
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 18 },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { width: 44, height: 2, background: "#7B1E2D" },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "Fraunces",
                          fontSize: 22,
                          fontWeight: 700,
                          fontStyle: "italic",
                          color: "#C28892",
                        },
                        children: "Todor Aleksandrov",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
