# ImagePreview Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/ImagePreview/`

## Purpose

Clickable thumbnail that opens a full-screen image lightbox. Centralizes the
preview behavior used by candidate cards, candidate detail modals, and
`ImageUpload`, so every image in the app has the same "click to view full size"
interaction.

The lightbox is rendered through a React portal to `document.body`, locks body
scroll while open, closes on backdrop click or `Escape`, and stops `Escape` from
also closing a parent `Modal`.

## Props

- `src`: `string` — image URL.
- `alt`: `string` — image alternative text; also used in the trigger label.
- `caption`: `string` (optional) — caption shown below the full-size image.
- `className`: `string` (optional) — classes for the thumbnail trigger (size, radius, border).
- `imageClassName`: `string` (optional) — classes for the thumbnail `<img>` (`object-cover`, etc.).
- `loading`: `"lazy" | "eager"` (optional, default `"lazy"`) — native image loading hint.
- `onError`: `() => void` (optional) — called when the image fails to load.

## Behavior

- Thumbnail is a native `<button>` with `cursor-zoom-in` and hover/focus overlay.
- Thumbnail click calls `stopPropagation()` so it never triggers a parent action
  (for example selecting a `CandidateRadioCard`).
- The full-size image uses `object-contain` with a dimmed backdrop and close button.
- Clicking the backdrop or pressing `Escape` closes the lightbox and returns focus
  to the thumbnail.
- `aria-hidden` overlay icon is decorative; the trigger has an explicit
  `aria-label` and the lightbox uses `role="dialog"` + `aria-modal="true"`.

## Semantic Tokens Used

- Thumbnail surface: `bg-muted`
- Hover overlay: `bg-foreground/40`, `text-background`
- Lightbox backdrop: `bg-foreground/80`, `backdrop-blur-sm`
- Close button: `bg-card`, `text-foreground`, `hover:bg-accent`, `focus:ring-ring`

## Code Example

```tsx
import ImagePreview from "@/components/molecules/ImagePreview";

<ImagePreview
  src={candidate.photoUrl}
  alt={candidate.name}
  caption={candidate.name}
  className="w-24 h-24 rounded-2xl border border-border"
  imageClassName="w-full h-full object-cover object-top"
/>;
```
