import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { styleImageFile } from "../../lib/cellar";
import { OG_PAGES, SITE } from "../../lib/site";

const inter = readFileSync(
  resolve("node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"),
);
const frauncesNormal = readFileSync(
  resolve("node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff"),
);
const frauncesItalic = readFileSync(
  resolve("node_modules/@fontsource/fraunces/files/fraunces-latin-700-italic.woff"),
);

type Page = { title: string; description: string; image?: string };

const PAGES: Record<string, Page> = OG_PAGES;

export const getStaticPaths: GetStaticPaths = async () => {
  const pagePaths = Object.entries(PAGES).map(([slug, props]) => ({ params: { slug }, props }));

  const bottles = await getCollection("cellar");
  const cellarPaths = bottles.map((b) => ({
    params: { slug: `cellar-${b.id}` },
    props: {
      title: b.data.name,
      description: `${b.data.producer} — ${b.data.note}`,
      image: `assets/cellar-og/${styleImageFile[b.data.style]}`,
    } satisfies Page,
  }));

  return [...pagePaths, ...cellarPaths];
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, image } = props as Page;
  const imageDataUri = image
    ? `data:image/jpeg;base64,${readFileSync(resolve("public", image)).toString("base64")}`
    : undefined;

  const svg = await satori(ogTemplate(title, description, imageDataUri), {
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

  // JPEG keeps the social cards small (~4x lighter than PNG).
  const jpeg = await sharp(png)
    .resize(1200, 630)
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
};

function ogTemplate(title: string, description: string, imageDataUri?: string) {
  const fontSize = title.length > 22 ? 62 : title.length > 14 ? 72 : 84;

  const outerChildren: unknown[] = [
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
          padding: imageDataUri ? "56px 60px 56px 80px" : "56px 80px",
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
              children: SITE.host,
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
                    children: SITE.name,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  if (imageDataUri) {
    outerChildren.push({
      type: "div",
      props: {
        style: { position: "relative", width: 380, height: "100%", flexShrink: 0, display: "flex" },
        children: [
          {
            type: "img",
            props: {
              src: imageDataUri,
              width: 380,
              height: 630,
              style: { objectFit: "cover", width: "100%", height: "100%" },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, #1A1614 0%, rgba(26,22,20,0.55) 25%, rgba(26,22,20,0) 60%)",
              },
            },
          },
        ],
      },
    });
  }

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#1A1614",
      },
      children: outerChildren,
    },
  };
}
