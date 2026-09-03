# Farah Aqrt — Portfolio

Personal portfolio site. Static, no build step: `index.html` + `style.css` + `script.js`,
with React (UMD), GSAP, and Lenis loaded from CDN.

**Live:** https://farahaqrt.github.io/portfolio/

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Editing

- Links (email, LinkedIn, GitHub, store URLs) — the `LINKS` object at the top of `script.js`
- Projects — the `projects` array in `script.js`; screenshots live in `assets/<project>/`
- Background bubbles — `FLOATING_BALLS` in `script.js` (set to `0` to remove)
- Smooth scrolling — `SMOOTH_SCROLL` in `script.js`
