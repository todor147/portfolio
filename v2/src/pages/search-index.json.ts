import { buildSearchIndex } from "../lib/search-index";

export const GET = async () => {
  const items = await buildSearchIndex();
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
