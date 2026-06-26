# Project Tech Stack

This document details the technologies, frameworks, and libraries used to build and run the **Indie Cafe Hub** web application.

---

## 🚀 Core Architecture

- **Meta-Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (utilizing React 19 and Vite)
- **Library:** [React 19](https://react.dev/)
- **Build Tool / Bundler:** [Vite 8](https://vite.dev/)
- **Programming Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Package Manager / Runtime:** [Bun](https://bun.sh/) (configured via `bun.lock` and `bunfig.toml`)

---

## 🧭 Routing & State Management

- **Routing:** [TanStack Router](https://tanstack.com/router) — Type-safe, client-side & server-side routing for React.
- **Server State / Data Fetching:** [TanStack Query](https://tanstack.com/query) (React Query v5) — Declarative, dependency-free state management for asynchronous data.

---

## 🎨 UI & Styling

- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework with native CSS variables and Vite support.
- **Component Primitives:** [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible UI components (Accordion, Dialog, Dropdown Menu, Popover, Select, Tabs, etc.).
- **Utility Styling Packages:**
  - `class-variance-authority` (CVA) — For managing component variants.
  - `clsx` & `tailwind-merge` — Dynamic class merging.
  - `tw-animate-css` — CSS animation utilities.
- **Icon Library:** [Lucide React](https://lucide.dev/) — Clean and consistent SVG icons.
- **UI Utilities:**
  - [Sonner](https://sonner.emilkowal.ski/) — Toast notifications.
  - [Vaul](https://github.com/emilkowalski/vaul) — Drawer components.
  - [Embla Carousel React](https://www.embla-carousel.com/) — Lightweight carousel/slider.
  - `input-otp` — One-time password inputs.

---

## 📝 Forms & Validation

- **Form Handling:** [React Hook Form](https://react-hook-form.com/) — Performant, flexible, and extensible forms.
- **Schema Validation:** [Zod](https://zod.dev/) — TypeScript-first schema declaration and validation.
- **Resolver:** `@hookform/resolvers` — Integration between React Hook Form and Zod.

---

## 📊 Data Visualization

- **Charting:** [Recharts](https://recharts.org/) — Redefined chart library built with React components.

---

## 🛠️ Tooling & Linting

- **Linter:** [ESLint 9](https://eslint.org/)
- **Formatter:** [Prettier 3](https://prettier.io/)
