# Cine-Stream — Storybook / Component-Driven Development

Storybook is installed inside this same Next.js repo (no separate project). Verified end
to end: dev server responds on `http://localhost:6006`, `npm run build-storybook`
produces a working `storybook-static/` (served and checked with `curl`, returned 200
for the index and for individual story iframes).

## Run it

```bash
npm install
npm run storybook          # dev server → http://localhost:6006
npm run build-storybook    # static production build → storybook-static/
```

Storybook runs completely decoupled from the Next.js app (`npm run dev` on port 3000
is a separate process) — you can browse and interact with components in Storybook
without the Next.js server running at all.

## How each requirement is met

### Phase 1 — Base Architecture
- Installed via `npx storybook@latest init --type nextjs`, using the
  `@storybook/nextjs-vite` framework — configured for *this* repo, not a fresh one.
  Config lives in `.storybook/main.ts` and `.storybook/preview.tsx`.
- Three components have stories, in `stories/`:
  - `Button.stories.tsx` — new design-system atom (`components/ui/Button.tsx`)
  - `Badge.stories.tsx` — new design-system atom (`components/ui/Badge.tsx`)
  - `MovieCard.stories.tsx` — the **real** app component (`components/MovieCard.tsx`,
    the same one used on the homepage), rendered here with mock data and mock
    callbacks, fully decoupled from Next.js routing/data-fetching.
- `npm run storybook` launches a local server on port 6006 where every story can be
  opened, viewed, and interacted with (click the favorite heart, toggle Controls,
  etc.) independent of the main app's runtime.

### Phase 2 — State & Integration
- Every story exposes **Args** wired to Storybook's Controls panel
  (`argTypes` in each `*.stories.tsx`). For `Button` and `Badge` specifically:
  `variant` is a `select` control (`primary` / `secondary`), and `disabled` is a
  `boolean` control — toggle either live from the Controls tab with no code
  changes. Named stories `Primary`, `Secondary`, and `Disabled` exist for both
  components as concrete presets of those same args.
- **Dark mode**: `@storybook/addon-themes` is registered in `.storybook/main.ts`.
  `.storybook/preview.tsx` uses `withThemeByClassName` to add a **theme toggle in
  the Storybook toolbar** (Light / Dark). Selecting a theme toggles the `dark`
  class on `<html>`; `tailwind.config.ts` has `darkMode: 'class'`, and `Button` /
  `Badge` use Tailwind `dark:` variants, so switching the toolbar control visibly
  re-themes the component live, the same way toggling the OS color scheme would
  in the real app.

### Phase 3 — Advanced Optimization
- `npm run build-storybook` runs Storybook's static compiler (Vite-based) and
  outputs a fully static site to `storybook-static/` — already built once in this
  delivery as proof it compiles cleanly (only non-blocking chunk-size warnings).
- **Deployment** — this sandbox has no network access to vercel.com or
  chromatic.com, so the actual push has to happen from your machine. Two options,
  both take one command once you're in the project folder:

  **Option A — Vercel CLI** (deploys the static folder directly, no `vercel.json`
  needed):
  ```bash
  npm run build-storybook
  npx vercel storybook-static --prod
  ```
  (First run will ask you to log in and link/create a project — accept the
  defaults.)

  **Option B — Chromatic** (built for Storybook specifically; also gives you
  visual regression testing per story):
  ```bash
  npm install --save-dev chromatic
  npx chromatic --project-token=<your-chromatic-project-token>
  ```
  Get a free project token by creating a project at chromatic.com and linking
  this repo.

## File map

```
.storybook/
  main.ts         addons: a11y, docs, themes; framework: @storybook/nextjs-vite
  preview.tsx      global CSS import, dark-mode toolbar toggle, background presets
components/ui/
  Button.tsx       Primary / Secondary variants, Disabled state, sm/md/lg sizes
  Badge.tsx        Primary / Secondary / Success / Disabled variants
stories/
  Button.stories.tsx     Primary, Secondary, Disabled, Playground
  Badge.stories.tsx      Primary, Secondary, Disabled, RatingWithIcon
  MovieCard.stories.tsx  Default, Favorited, HighlyRated, LowerRated
storybook-static/  pre-built static output (regenerate anytime with build-storybook)
```
