# AtomiaBot Frontend

A fast, modern React frontend built with Vite, Tailwind CSS v4, and React Router. This app powers the AtomiaBot user interface and is optimized for quick local development and easy deployment.

## Tech Stack
- React 19 + Vite 7
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- React Router 7
- Axios for HTTP
- Lucide Icons


## Getting Started
### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
- Runs the Vite dev server (default: `http://localhost:5173`).

### Production Build
```bash
npm run build
```
- Outputs static assets to `dist/`.

### Preview Production Build
```bash
npm run preview
```
- Serves the built `dist/` locally to verify the production build.

## Scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run preview` — preview the production build


## Project Structure
```
Frontend/
├── index.html
├── vite.config.js
├── eslint.config.js
├── public/
│   ├── images/
│   ├── videos/
│   └── JSON/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── App.css
    └── assets/
```

## Styling (Tailwind CSS v4)
- Tailwind is activated via `@tailwindcss/vite` in `vite.config.js`.
- The stylesheet `src/index.css` imports Tailwind with:
  ```css
  @import "tailwindcss";
  ```
- Use utility classes directly in your React components.

## Routing
- Configured with React Router (see `src/App.jsx`).
- Uses `createBrowserRouter` and `RouterProvider`.



## Linting
```bash
npm run lint
```
- ESLint is configured via `eslint.config.js`.

## Deployment
- The app builds to static files in `dist/`.
- You can deploy to any static host (Vercel, Netlify, etc.).
- A `vercel/` directory exists for Vercel-specific config if needed.

## Notes
- Favicon path is set in `index.html` via `public/images/favicon.ico`.
- Update `title` in `index.html` to change the page title.