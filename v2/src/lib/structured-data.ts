/** Small JSON-LD helpers. Output is plain data; undefined/empty values are stripped. */

export const personId = (site: URL | string): string => new URL("/#person", site).href;

export interface Crumb {
  name: string;
  /** Site-relative path with trailing slash, e.g. "/projects/". */
  path: string;
}

export function breadcrumbs(crumbs: Crumb[], site: URL | string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.path, site).href,
    })),
  };
}

/** Recursively drop undefined, null, empty strings and empty arrays. */
export function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(clean).filter((v) => v !== undefined) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const c = clean(v);
      if (c === undefined || c === null || c === "" || (Array.isArray(c) && c.length === 0)) continue;
      out[k] = c;
    }
    return out as T;
  }
  return value;
}
