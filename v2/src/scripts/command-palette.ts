/**
 * Command palette behaviour. Fetches /search-index.json on first open,
 * then filters, groups and renders results client-side.
 * APG combobox pattern: focus stays on the input; aria-activedescendant
 * points at the active option in the listbox.
 */
interface SearchItem {
  group: string;
  title: string;
  note?: string;
  href: string;
  key: string;
}

interface Row {
  item: SearchItem;
  el: HTMLElement;
}

const dialog = document.getElementById("cmdk-dialog") as HTMLDialogElement | null;
const input = document.getElementById("cmdk-input") as HTMLInputElement | null;
const list = document.getElementById("cmdk-list") as HTMLElement | null;
const statusEl = document.getElementById("cmdk-status") as HTMLElement | null;
const message = document.getElementById("cmdk-message") as HTMLElement | null;

if (dialog && input && list && statusEl && message) {
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    "";
  const shortcutLabel = /Mac|iPhone|iPad/i.test(platform) ? "⌘K" : "Ctrl K";
  document.querySelectorAll<HTMLElement>("[data-palette-shortcut]").forEach((node) => {
    node.textContent = shortcutLabel;
  });

  let items: SearchItem[] | null = null;
  let loading: Promise<void> | null = null;
  let failed = false;
  let rows: Row[] = [];
  let cursor = 0;

  function make<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showMessage(text: string | null) {
    message!.hidden = text === null;
    message!.textContent = text ?? "";
  }

  function load(): Promise<void> {
    if (items) return Promise.resolve();
    if (loading) return loading;
    loading = fetch("/search-index.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data: SearchItem[]) => {
        items = data;
        failed = false;
      })
      .catch(() => {
        failed = true;
        loading = null; // allow a retry on next open
      });
    return loading;
  }

  function highlight(parent: HTMLElement, text: string, tokens: string[]) {
    const lower = text.toLowerCase();
    const ranges: [number, number][] = [];
    tokens.forEach((t) => {
      let start = 0;
      let idx: number;
      while ((idx = lower.indexOf(t, start)) !== -1) {
        ranges.push([idx, idx + t.length]);
        start = idx + t.length;
      }
    });
    if (ranges.length === 0) {
      parent.textContent = text;
      return;
    }
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [ranges[0]];
    for (const r of ranges.slice(1)) {
      const last = merged[merged.length - 1];
      if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r);
    }
    let pos = 0;
    merged.forEach(([s, e]) => {
      parent.append(document.createTextNode(text.slice(pos, s)));
      parent.append(make("mark", "cmdk-mark", text.slice(s, e)));
      pos = e;
    });
    parent.append(document.createTextNode(text.slice(pos)));
  }

  function setActive(next: number, scroll = true) {
    if (rows.length === 0) {
      input!.removeAttribute("aria-activedescendant");
      return;
    }
    cursor = Math.max(0, Math.min(next, rows.length - 1));
    rows.forEach(({ el }, i) => {
      el.setAttribute("aria-selected", i === cursor ? "true" : "false");
    });
    const active = rows[cursor].el;
    input!.setAttribute("aria-activedescendant", active.id);
    if (scroll) active.scrollIntoView({ block: "nearest" });
  }

  function render() {
    list!.replaceChildren();
    rows = [];
    input!.removeAttribute("aria-activedescendant");
    if (!items) {
      input!.setAttribute("aria-expanded", "false");
      return;
    }

    const q = input!.value.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    // Rank: title starts with query, title contains query, other matches.
    const groups = new Map<string, { item: SearchItem; rank: number }[]>();
    items.forEach((item) => {
      if (!tokens.every((t) => item.key.includes(t))) return;
      const title = item.title.toLowerCase();
      const rank = q && title.startsWith(q) ? 0 : q && title.includes(q) ? 1 : 2;
      const bucket = groups.get(item.group) ?? [];
      bucket.push({ item, rank });
      groups.set(item.group, bucket);
    });

    // With a query, the group holding the best match comes first; otherwise index order.
    const ordered = [...groups.entries()];
    if (tokens.length) {
      const best = (b: { rank: number }[]) => Math.min(...b.map((x) => x.rank));
      ordered.sort((a, b) => best(a[1]) - best(b[1]));
    }

    let n = 0;
    ordered.forEach(([group, bucket], gi) => {
      bucket.sort((a, b) => a.rank - b.rank);
      const wrap = make("div");
      wrap.setAttribute("role", "group");
      const headingId = `cmdk-group-${gi}`;
      wrap.setAttribute("aria-labelledby", headingId);
      const heading = make("p", "cmdk-group", group);
      heading.id = headingId;
      wrap.append(heading);

      bucket.forEach(({ item }) => {
        const row = make("div", "cmdk-option");
        row.id = `cmdk-opt-${n}`;
        row.setAttribute("role", "option");
        row.setAttribute("aria-selected", "false");
        row.dataset.index = String(n);
        const title = make("p", "cmdk-title");
        highlight(title, item.title, tokens);
        row.append(title);
        if (item.note) row.append(make("p", "cmdk-note", item.note));
        wrap.append(row);
        rows.push({ item, el: row });
        n++;
      });
      list!.append(wrap);
    });

    input!.setAttribute("aria-expanded", rows.length > 0 ? "true" : "false");
    if (rows.length === 0) {
      showMessage("Nothing matches. Try a different word.");
      statusEl!.textContent = "No results";
    } else {
      showMessage(null);
      statusEl!.textContent = `${rows.length} result${rows.length === 1 ? "" : "s"}`;
    }
    setActive(0, false);
    list!.scrollTop = 0;
  }

  async function openPalette() {
    if (dialog!.open) return;
    input!.value = "";
    statusEl!.textContent = "";
    dialog!.showModal();
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => input!.focus());
    if (!items) {
      render();
      showMessage("Loading…");
      await load();
      if (!items) {
        showMessage(failed ? "Search couldn't load. Check your connection and try again." : "Loading…");
        return;
      }
    }
    render();
  }

  function closePalette() {
    if (dialog!.open) dialog!.close();
    document.body.style.overflow = "";
  }

  function activate(item: SearchItem) {
    closePalette();
    if (/^https?:/.test(item.href)) window.open(item.href, "_blank", "noopener");
    else window.location.href = item.href;
  }

  // Ctrl+K / ⌘K toggles
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (dialog.open) closePalette();
      else void openPalette();
    }
  });

  // Any element with data-palette-open opens the palette (delegated)
  document.addEventListener("click", (e) => {
    const target = e.target as Element | null;
    if (target?.closest("[data-palette-open]")) {
      e.preventDefault();
      void openPalette();
    }
  });

  // Programmatic hook: document.dispatchEvent(new Event("palette:open"))
  document.addEventListener("palette:open", () => void openPalette());

  input.addEventListener("input", () => {
    if (items) render();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette(); // native <dialog> restores focus to the opener
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(cursor + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(cursor - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rows[cursor]) activate(rows[cursor].item);
    }
  });

  list.addEventListener("click", (e) => {
    const opt = (e.target as Element).closest<HTMLElement>("[role=option]");
    if (!opt) return;
    const row = rows[Number(opt.dataset.index)];
    if (row) activate(row.item);
  });

  list.addEventListener("mousemove", (e) => {
    const opt = (e.target as Element).closest<HTMLElement>("[role=option]");
    if (!opt) return;
    const idx = Number(opt.dataset.index);
    if (idx !== cursor) setActive(idx, false);
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closePalette();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
}
