# CampusForge AI Studio

A premium single-college AI prompt and workflow platform for web development, digital creation, and student/faculty production teams.

## What It Includes

- Cinematic landing page with clear product positioning and calls to action.
- Local demo authentication for one college workspace.
- Workspace dashboard with prompt builder, project pipeline, metrics, and review queue.
- Prompt library with search, categories, and copy-ready templates.
- Project board for website and digital creation workflows.
- Consistent responsive UI built with React, Vite, Tailwind CSS, Lucide icons, Framer Motion, and Recharts.

## Getting Started

```bash
npm run dev
```

The app runs from the `frontend` workspace.

## Build

```bash
npm run build
npm run preview
```

## Demo Login

Use any of these demo users with password `studio123`:

| Role | Email |
| --- | --- |
| Studio Lead | lead@college.edu |
| Faculty Mentor | mentor@college.edu |
| Student Creator | creator@college.edu |

## Project Structure

- `frontend/src/pages`: Landing, login, workspace, library, projects, settings, and fallback pages.
- `frontend/src/layouts`: Protected workspace shell.
- `frontend/src/context`: Local demo authentication.
- `frontend/src/data`: Single source of product content and demo workflow data.
- `frontend/src/components`: Shared UI components.
