# ThriveWell Partners — Landing Page

Modern one-page marketing site for **ThriveWell Partners**, built with React + Vite + Tailwind CSS. Designed to deploy on Vercel.

## Brand palette

| Token   | Hex       | Use                    |
| ------- | --------- | ---------------------- |
| `cream` | `#F6F7F2` | Page background        |
| `navy`  | `#062A43` | Headings, dark section |
| `teal`  | `#2C8CA2` | Accents, links, hover  |
| `sage`  | `#80B165` | Highlights, gradients  |

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy to Vercel

Push to a Git repo and import into Vercel, or run:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Vercel auto-detects the Vite framework (see `vercel.json`).

## Assets

- `public/logo.jpg` — web-optimised logo (drop-in replaceable).
