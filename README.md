# heena.ca

My personal site. Built with React, TypeScript and Vite, and deployed to GitHub Pages with GitHub Actions.

**Live:** [heena.ca](https://heena.ca)

## Run it locally

```bash
npm install
npm run dev
```

## How it's put together

- `src/data.ts` holds all the content (projects, experience, skills), so updating the site means editing data, not layout.
- `src/App.tsx` renders the page. The work section can be filtered between software and data projects, and each project opens into the full story.
- `src/styles.css` has light and dark themes driven by CSS variables. The theme follows your system setting and can be toggled.
- `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
