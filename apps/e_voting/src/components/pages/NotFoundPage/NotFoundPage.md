# NotFoundPage Component

- **Level**: Page
- **Folder**: `src/components/pages/NotFoundPage/`

## Purpose
The `NotFoundPage` component provides a polished 404 error experience when users navigate to undefined routes. It dynamically determines whether the visitor is authenticated, providing a direct CTA to either return to their designated role landing page or back to the login screen.

## Props
None. Self-contained page component.

## Semantic Tokens Used
- Outer Canvas: `bg-background`
- Card Container: `bg-card`, `border-border`, `shadow-sm`, `rounded-3xl`
- Status Badge: `bg-warning-subtle`, `text-warning-subtle-foreground`
- Typography: `font-heading`, `font-sans`, `text-foreground`, `text-muted-foreground`

## Code Example
```tsx
import { NotFoundPage } from "@/components/pages/NotFoundPage";

<Route path="*" element={<NotFoundPage />} />
```
