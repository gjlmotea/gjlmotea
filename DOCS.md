# gjlmotea — Developer Documentation

Technical reference for the **gjlmotea** identity site: a single-page, scroll-driven
black-and-white exploration of one wordmark.

- **Live site:** https://gjlmotea.pages.dev
- **Repository:** `git@github.com:gjlmotea/gjlmotea.git` (also the GitHub profile repo)

---

## Tech stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | React 19 + TypeScript                   |
| Build tool | Vite 6                                  |
| Styling    | Tailwind CSS v4 (`Inter` font)          |
| Animation  | Motion (formerly Framer Motion)         |
| Hosting    | Static — deployable to any CDN/host     |

---

## Project structure

```
.
├── index.html              # SEO meta, JSON-LD, OG tags, noscript fallback
├── src/
│   ├── main.tsx            # React entry
│   ├── App.tsx             # All 22 scroll sections, organised into 5 "Acts"
│   └── index.css           # Tailwind + Inter font import
├── public/                 # Static assets copied verbatim into dist/
│   ├── favicon.svg  og-image.svg  llms.txt  robots.txt  sitemap.xml
├── scripts/
│   └── build_yearly.py     # Generates per-year commit SVGs (GitHub GraphQL)
├── .github/workflows/
│   └── yearly.yml          # Daily job → builds yearly SVGs → pushes to `output` branch
└── deploy/                 # Platform deploy templates (see Deployment below)
```

`src/App.tsx` is a single file containing all visual sections. Each section is a
self-contained component; they are composed top-to-bottom in `App()` and grouped
into five narrative "Acts" (Dark World → First Light → Dialogue → Mirror World →
Finale).

---

## Local development

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run lint       # type-check (tsc --noEmit)
```

Node 22 is recommended (matches the CI workflows).

---

## Deployment

The build output (`dist/`) is fully static — no server, no API, no environment
variables required at runtime. It can therefore be mirrored across any number of
free static hosts. The same `npm run build` → `dist/` pipeline works everywhere.

### Hosting mirrors (`brand` = `gjlmotea`)

| Subdomain (`gjlmotea.*`)     | Platform         | Config file                 | Status            |
| ---------------------------- | ---------------- | --------------------------- | ----------------- |
| `gjlmotea.pages.dev`         | Cloudflare Pages | (dashboard settings)        | ✅ Live           |
| `gjlmotea.web.app`           | Firebase Hosting | `firebase.json`, `.firebaserc` | ⚙️ Config ready |
| `gjlmotea.firebaseapp.com`   | Firebase Hosting | `firebase.json`, `.firebaserc` | ⚙️ Config ready |
| `gjlmotea.vercel.app`        | Vercel           | `vercel.json`               | ⚙️ Config ready   |
| `gjlmotea.netlify.app`       | Netlify          | `netlify.toml`              | ⚙️ Config ready   |
| `gjlmotea.github.io`         | GitHub Pages     | `deploy/github-pages.yml`   | ⚙️ Config ready   |
| `gjlmotea.gitlab.io`         | GitLab Pages     | `.gitlab-ci.yml`            | ⚙️ Config ready   |
| `gjlmotea.fly.dev`           | Fly.io           | `fly.toml`, `deploy/fly/`   | ⚙️ Config ready   |
| `gjlmotea.onrender.com`      | Render           | `render.yaml`               | ⚙️ Config ready   |

> **Each platform requires a one-time login with your own account.** The config
> files below make every host "connect-and-go": once the account/project is linked,
> a `git push` (or a single CLI command) publishes the site. The subdomain is
> derived from the **project/app/site name**, so name each project `gjlmotea`.

### Per-platform setup

**Cloudflare Pages → `gjlmotea.pages.dev`** *(already live)*
- Dashboard: Workers & Pages → Create → Pages → Connect to Git → `gjlmotea/gjlmotea`
- Build command `npm run build`, output directory `dist`
- CLI alternative: `npx wrangler pages deploy dist --project-name=gjlmotea`

**Firebase Hosting → `gjlmotea.web.app` + `gjlmotea.firebaseapp.com`**
- Create a Firebase project with **project ID `gjlmotea`** (this ID becomes the subdomain).
- `npm i -g firebase-tools && firebase login`
- `npm run build && firebase deploy --only hosting`
- Uses `firebase.json` (public dir `dist`) and `.firebaserc` (default project `gjlmotea`).

**Vercel → `gjlmotea.vercel.app`**
- `npm i -g vercel && vercel login`
- `vercel --prod` — name the project **`gjlmotea`** on first run.
- Or dashboard: Add New → Project → import `gjlmotea/gjlmotea` (Vite auto-detected via `vercel.json`).

**Netlify → `gjlmotea.netlify.app`**
- `npm i -g netlify-cli && netlify login`
- `netlify sites:create --name gjlmotea`
- `npm run build && netlify deploy --prod --dir=dist`
- Or dashboard: Add new site → Import from Git. Build settings come from `netlify.toml`.

**GitHub Pages → `gjlmotea.github.io`**
- The root user-site URL requires a repo named **exactly `gjlmotea.github.io`** (separate
  from this profile repo).
- Create that repo, copy this site's source into it, and add `deploy/github-pages.yml`
  as `.github/workflows/deploy.yml`.
- Repo → Settings → Pages → Source: **GitHub Actions**. Pushing to `main` then publishes.

**GitLab Pages → `gjlmotea.gitlab.io`**
- The root user-site URL requires a GitLab project named **`gjlmotea.gitlab.io`** under
  the `gjlmotea` namespace.
- Push this repo (it includes `.gitlab-ci.yml`) to that project; the `pages` CI job
  builds and publishes automatically.

**Fly.io → `gjlmotea.fly.dev`**
- Install flyctl, then `fly auth login`.
- App name is `gjlmotea` (set in `fly.toml`); it serves `dist/` via nginx
  (`deploy/fly/Dockerfile`, `deploy/fly/nginx.conf`).
- `fly deploy` (first time: `fly apps create gjlmotea`).

**Render → `gjlmotea.onrender.com`**
- Dashboard: New → Blueprint → connect `gjlmotea/gjlmotea` → `render.yaml` is detected.
- Static site, service name `gjlmotea`, publish path `dist`.

### Token-based (CI / non-interactive) deploys

Several platforms accept an API token so a deploy can run without an interactive
browser login (useful for CI or for delegating the deploy):

| Platform   | Token env var              | Command (after `npm run build`)                              |
| ---------- | -------------------------- | ----------------------------------------------------------- |
| Cloudflare | `CLOUDFLARE_API_TOKEN`     | `npx wrangler pages deploy dist --project-name=gjlmotea`    |
| Netlify    | `NETLIFY_AUTH_TOKEN`       | `npx netlify deploy --prod --dir=dist`                      |
| Vercel     | `VERCEL_TOKEN`             | `npx vercel deploy --prod --token=$VERCEL_TOKEN`            |
| Firebase   | `FIREBASE_TOKEN` / CI key  | `npx firebase-tools deploy --only hosting --token=$FIREBASE_TOKEN` |

---

## Yearly commit stats pipeline

`scripts/build_yearly.py` renders the "commits per year" chart shown in the profile
README.

- Runs daily via `.github/workflows/yearly.yml` (05:00 UTC ≈ 13:00 Taipei).
- Queries the GitHub GraphQL `contributionsCollection` API for per-year commit totals.
- Emits `dist/yearly-dark.svg` and `dist/yearly-light.svg`, force-pushed to the
  `output` branch, which the README references via `raw.githubusercontent.com`.

**Required secret:** `GH_USER_TOKEN` — a token with `read:user` scope. To include
private contributions, enable "Include private contributions on my profile" in your
GitHub settings.
