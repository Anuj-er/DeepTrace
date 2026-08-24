# DeepTrace — Frontend

The web client for **DeepTrace**, an Explainable Deepfake Detection System. Built with React and Vite, it provides an intuitive, interactive interface for deepfake image analysis, visual forensic explanations, inspection history, and forensic report export.

---

## Tech Stack

- **React 18** with **Vite 5** — Modern UI framework and build tooling with Fast Refresh
- **Tailwind CSS 3** — Utility-first styling and responsive dark theme design
- **Framer Motion** — Fluid UI transitions and micro-interactions
- **Lucide React** — Modern, consistent icon library
- **react-dropzone** — Drag-and-drop file upload handling

---

## Components

All core views are located in `src/components/`:

- **`Landing.jsx`** — Marketing landing page with feature showcase and system overview
- **`Login.jsx`** — JWT authentication handling login and registration forms
- **`Dashboard.jsx`** — Image upload workspace with drag-and-drop support
- **`Results.jsx`** — Analysis results display covering verdict, confidence score, Grad-CAM heatmaps, ELA (Error Level Analysis), face detection, and forensic metadata
- **`History.jsx`** — Past analyses log with search, verdict filtering, and date sorting
- **`Settings.jsx`** — User profile management and application settings
- **`ReportPreview.jsx`** — Forensic PDF report preview and export

---

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Root component with routing/state
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles + Tailwind directives
│   └── components/          # All page components
├── index.html
├── vite.config.js           # Dev server + API proxy
├── tailwind.config.js       # Tailwind theme config
├── postcss.config.js
└── package.json
```

---

## Getting Started

### 1. Installation

Install project dependencies:

```bash
npm install
```

### 2. Development Server

Start the Vite development server:

```bash
npm run dev
```

The application runs at **http://localhost:5173**. All `/api` requests are automatically proxied to the backend at `http://127.0.0.1:8000` (configured in `vite.config.js`).

---

## Build

To create an optimized production build:

```bash
npm run build
```

Production-ready assets are compiled and output to the `dist/` directory.
