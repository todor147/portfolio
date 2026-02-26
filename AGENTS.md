# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-dependency static portfolio website (HTML, CSS, vanilla JS). There is no package manager, no build system, and no backend.

### Serving locally

Use `serve` (installed globally via npm) to run a local dev server:

```
serve -l 3000
```

Alternatively, `python3 -m http.server 3000` works.

### Linting

- **HTML**: `htmlhint index.html thanks.html`
- **JS**: `jshint --config <(echo '{"esversion": 11, "browser": true, "devel": true, "undef": false, "unused": false}') script.js` — the codebase uses ES11+ syntax (optional chaining, arrow functions, etc.), so `esversion: 11` is required.
- **CSS**: `csslint --quiet style.css mediaqueries.css` — expect non-blocking warnings about font-size counts and `!important` usage; these are style warnings, not errors.

### Project structure

- `index.html` — main portfolio page
- `thanks.html` — form submission thank-you page
- `style.css` — main styles with CSS custom properties for theming
- `mediaqueries.css` — responsive breakpoints
- `script.js` — all interactivity (menu, theme toggle, scroll animations, gallery, project filtering)
- `assets/` — images and PDF files

### Notes

- The contact form submits to FormSubmit.co (external service); it will not function fully in a sandboxed environment.
- Theme toggle (light/dark/auto) persists to `localStorage`.
