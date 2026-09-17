# Ibbo Abdoli — industrial automation portfolio

Production: https://www.ibboabdoli.com/  
Repository: ibboabdoli-ai/ibboabdoli  
Host: Vercel, project `ibboabdoli`, production branch `main`.

## Source of truth

The root HTML pages and `assets/` are maintained source. `en/` contains the English equivalents; `cases/` and `en/cases/` contain three paired anonymised cases; `card/` contains the digital card and vCard; `privacy/` and `en/privacy/` explain contact processing. Visual SVG markup is static HTML. `assets/visuals.css` owns animation styles, and `assets/site.js` only owns behaviour.

`archive/public_html/` preserves the historic site for reference, not deployment. Historical release markers live in `docs/history/`. Do not edit either location to update production. Existing legacy social-image workflows are historical tooling; review their file targets before manually invoking them.

## Build and local preview

Use Node.js 22 or 24. Production has no npm dependencies or frontend framework.

```sh
node scripts/build.mjs
python3 tests/static_checks.py
python3 scripts/serve.py
```

Open http://127.0.0.1:4173. Only explicitly allowlisted files are copied to `dist/`; archives, tooling and documentation cannot leak into the production build. The local server applies the production security headers. Vercel automatically builds a preview for non-main branches and production after a merge to `main`.

## Quality checks

`tests/static_checks.py` checks internal links, fragments, metadata, hreflang, sitemap, JSON-LD, inline content restrictions and PDF signatures. The browser suite checks responsive layouts, keyboard navigation, no-JavaScript content, motion preferences and mocked form success/error handling. Formspree is mocked in automated tests: a passing test does not prove inbox delivery. CI also records Lighthouse lab measurements; those are not field Core Web Vitals.

## Contact, privacy and external services

The form uses the existing Formspree endpoint. Native form POST works without JavaScript; enhanced submission keeps feedback on the site and retains text when delivery cannot be confirmed. Booking links use the existing Cal.com events. The existing Gmail address remains unchanged; no new domain mailbox has been provisioned. Google Fonts remains an external font request and is described in the privacy information. No analytics SDK or marketing cookies were added.

## SEO and security maintenance

Keep reciprocal `sv`, `en` and `x-default` alternates and the www canonical host. Update `sitemap.xml` lastmod only when page content materially changes. Case studies separate diagnosis from confirmed outcomes; do not add customer names, sensitive production details or invented metrics. The sitemap is discoverable via robots.txt; Search Console submission and Google indexing are separate, account-dependent operations.

The CSP permits same-origin scripts, approved external fonts and the existing Formspree destination. Inline JSON-LD is hash-authorised. When editing JSON-LD, regenerate hashes with `python3 scripts/update_csp.py` and re-run all tests before deploying. The local test server reads the same CSP from `vercel.json`.

## Release and rollback

Test in a branch and merge only a verified head. Previous production baseline: `efde06f62994f96a3e555662b8bafbad7692809d` (2026-09-17). Use a Git revert PR for code rollback or Vercel's previous production deployment for immediate hosting rollback. Do not force-push `main`.
