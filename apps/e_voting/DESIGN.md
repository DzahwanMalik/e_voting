# Design System Foundation: E-Voting

This document serves as the **Design System Foundation & Master Token Guide** for `apps/e_voting`.

Detailed component-level specifications are intentionally decentralized: **this project follows the Atomic Design methodology**, where every component (Atom, Molecule, Organism, Layout, Page) maintains its own co-located markdown (`.md`) documentation file.

---

## 1. Design Aesthetic & Core Philosophy

- **Style**: Modern Minimalist SaaS / Productivity Dashboard.
- **Visual Feel**: Airy, clean, high-contrast readability, generous whitespace, subtle 1px borders, and soft layered surfaces.
- **Visual Hierarchy**:
  - **Canvas (Outer Background)**: Soft neutral gray (`bg-background`).
  - **Container / Shell**: Clean white surface with generous curved corners (`bg-card rounded-3xl border border-border shadow-sm`).
  - **Cards & Widgets**: Contained modules with crisp 1px borders (`bg-card rounded-2xl border border-border`).
  - **Controls & Pills**: Rounded controls (`rounded-xl`) and fully rounded pills/badges (`rounded-full`).

---

## 2. Design Tokens System (`global.css`)

All components **MUST** strictly consume these semantic tokens. **Never use arbitrary hex codes** (e.g., `bg-[#2563eb]`).

### 2.1 Surfaces & Content
| Role | Tailwind Class | CSS Variable | Light Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Page Canvas** | `bg-background` | `--background` | `#f4f5f7` | Outer canvas & app background |
| **Base Foreground** | `text-foreground` | `--foreground` | `#111827` | Primary text and major headings |
| **Card Surface** | `bg-card` | `--card` | `#ffffff` | Surface for containers, cards, dialogs |
| **Card Text** | `text-card-foreground` | `--card-foreground` | `#111827` | Content inside cards |
| **Muted Fill** | `bg-muted` | `--muted` | `#f9fafb` | Input fills, stat containers, chips |
| **Muted Text** | `text-muted-foreground` | `--muted-foreground` | `#6b7280` | Subtitles, labels, timestamps, metadata |
| **Accent / Hover** | `bg-accent` | `--accent` | `#f3f4f6` | Hover state for rows, items, buttons |
| **Accent Text** | `text-accent-foreground` | `--accent-foreground` | `#111827` | Text when hovered/highlighted |

### 2.2 Brand & Actions
| Role | Tailwind Class | Light Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `bg-primary text-primary-foreground` | `#2563eb` / `#ffffff` | Primary CTA, active navigation item |
| **Primary Hover** | `hover:bg-primary-hover` | `#1d4ed8` | Interactive hover state |
| **Secondary Tint** | `bg-secondary text-secondary-foreground` | `#eff6ff` / `#1d4ed8` | Subtle active state, selected chips |

### 2.3 Semantic Status Badges & Indicators
| Semantic Status | Background Class | Foreground Class | Usage |
| :--- | :--- | :--- | :--- |
| **Success (In Progress)** | `bg-success-subtle` | `text-success-subtle-foreground` | Positive / active progress (`#dcfce7` / `#15803d`) |
| **Pending** | `bg-pending-subtle` | `text-pending-subtle-foreground` | Awaiting action / pending (`#fce7f3` / `#be185d`) |
| **Info / Completed** | `bg-info-subtle` / `bg-primary` | `text-info-subtle-foreground` / `text-primary-foreground` | Informative state or completed task |
| **Warning** | `bg-warning-subtle` | `text-warning-subtle-foreground` | Alerts, caution notices |
| **Destructive** | `bg-destructive` | `text-destructive-foreground` | Errors, deletions, critical actions |

### 2.4 Borders, Inputs & Focus
- **Subtle Border**: `border border-border` (`#eceef1`)
- **Border Hover**: `border-border-hover` (`#e2e8f0`)
- **Input Border**: `border border-input` (`#e5e7eb`)
- **Focus Ring**: `focus:ring-2 focus:ring-ring focus:outline-none`

### 2.5 Typography
- **Heading / Logo**: `font-heading` (*Playfair Display*, Serif) — Brand identity, hero greetings, key title accents.
- **Interface / Content**: `font-sans` (*Plus Jakarta Sans* / *Inter*, Sans-serif) — General UI, navigation, tables, controls.

### 2.6 Border Radius Scale
- **Shell / Outer Dashboard**: `rounded-3xl` (`12px` – `16px`)
- **Cards & Widgets**: `rounded-2xl` (`10px` – `12px`)
- **Inputs & Controls**: `rounded-xl` (`8px`)
- **Pills, Badges & Avatars**: `rounded-full` (`9999px`)

---

## 3. Atomic Design Architecture

Frontend components are organized using the **Atomic Design** hierarchy under `src/components/`:

```
src/components/
├── atoms/        # Primitive elements (Button, Input, Badge, Avatar, Icon, Checkbox)
├── molecules/    # Combinations of 2+ atoms (SearchInput, NavItem, StatItem, DatePickerCol)
├── organisms/    # Distinct functional UI blocks (Sidebar, Header, ScheduleWidget, NotesWidget, TaskTable)
├── layout/       # Layout structures and skeletons (DashboardLayout, AuthLayout)
└── pages/        # Route views populated with business logic and data
```

### 3.1 Component Documentation & Structure Standard
Each component must be strictly self-contained in its folder and include its own implementation, type definitions, co-located markdown documentation file, and centralized `index.ts` export file:
```
src/components/atoms/Badge/
├── Badge.tsx      # Component implementation
├── Badge.types.ts # TypeScript interfaces and types
├── Badge.md       # Co-located documentation: props, variants, states, usage
└── index.ts       # Centralized export for this component
```

The component `.md` should document:
1. **Component Purpose & Level** (Atom / Molecule / Organism / Layout / Page).
2. **Props & Variants** (e.g., variant: `success` | `pending` | `info` | `primary`).
3. **Semantic Tokens Used** (mapping to `global.css`).
4. **Code Example** showing standard implementation.

### 3.2 Per-Component Centralized Exports (`index.ts`)
Each component must centralize all its exports (the component implementation and its types) within its own dedicated `index.ts`:

- **Single Component Entry Point**: The `index.ts` inside each component folder acts as the single export gate for that component:
  ```ts
  // src/components/atoms/Badge/index.ts
  export * from "./Badge";
  export * from "./Badge.types";
  ```
- **Clean Imports**: Consumers import directly from the component folder rather than reaching into internal files:
  ```tsx
  // Directly from component folder
  import Badge from "@/components/atoms/Badge";
  import { type BadgeProps } from "@/components/atoms/Badge";
  ```
- **No Root Components Index**: A root `src/components/index.ts` is intentionally **not** used. Consumers import directly from each component's folder to ensure optimal tree-shaking, clear module boundaries, and no monolithic re-export bottlenecks.

---

## 4. Fundamental Rules for `.tsx` Implementation

1. **Strict Token Usage**: Never write hardcoded color hexes or inline styles.
2. **Hierarchy Respect**: Atoms must remain pure and reusable without business logic. Molecules combine atoms. Organisms compose molecules and atoms. Layout components assemble structural shells and skeletons. Pages populate layouts with routes, business logic, and data.
3. **Component Documentation**: Whenever creating a new component, always create its corresponding `.md` file detailing its specification.
4. **Per-Component Centralized Exports**: Each component folder must include its own `index.ts` centralizing exports of the component and its types. Consumers must not import directly from `[Name].tsx` or `[Name].types.ts`.
5. **Verification**: Always run `npm run build` in `apps/e_voting` to verify zero TypeScript errors and zero CSS warnings.
