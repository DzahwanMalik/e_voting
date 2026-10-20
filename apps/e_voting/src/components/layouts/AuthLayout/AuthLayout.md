# AuthLayout Component

- **Level**: Layout
- **Folder**: `src/components/layouts/AuthLayout/`

## Purpose

The `AuthLayout` component provides the outer shell for authentication pages using a **split-screen composition**:

- **Left panel (always visible)**: white form surface, the product brand (logo + wordmark), an eyebrow label, page title/subtitle, the form content passed via `children`, and a quiet footer with the version text.
- **Right panel (desktop only, `lg` and above)**: full-bleed looping video thumbnail with a primary gradient overlay, a contextual pill, one headline, one short supporting sentence, and three compact trust indicators.
- **Mobile (`< lg`)**: the video panel is hidden, and the form panel occupies the full viewport with the brand header.

### Content allocation (desktop)

| Form panel (primary) | Video panel (decorative) |
| :--- | :--- |
| Brand orientation | Campaign/storytelling message |
| Eyebrow "Portal Pemilihan" | Context pill "Pemungutan Suara Digital" |
| Page title + subtitle | Headline + one supporting paragraph |
| Form fields & primary CTA | Trust indicators (icons + labels only) |
| Version metadata in footer | — |

The brand is intentionally **not duplicated** on the video side, so the login form remains the single visual focus. Trust indicators are labels only (no descriptions) to avoid competing with the form.

The video is decorative only (`aria-hidden`, `muted`, `autoPlay`, `loop`, `playsInline`). If the video file is unavailable, the panel still renders correctly thanks to the `bg-primary` + gradient fallback.

## Props

| Prop          | Type        | Default                       | Description                                                       |
| :------------ | :---------- | :---------------------------- | :---------------------------------------------------------------- |
| `children`    | `ReactNode` | **required**                  | The form/content rendered on the left panel                       |
| `title`       | `string`    | `"E-Voting"`                  | Form panel title                                                  |
| `subtitle`    | `string`    | `"Sistem Pemungutan Suara Digital"` | Form panel subheading                                       |
| `badgeText`   | `string`    | `"MVP v0.1.0"`                | Version text shown in the form footer (hidden if empty)            |
| `videoSrc`    | `string`    | `"/videos/bumper.mp4"`        | Video thumbnail source for the right panel                        |
| `videoPoster` | `string`    | `undefined`                   | Optional poster image shown before the video starts               |

## Video Asset

The default thumbnail video is served as a static public asset:

```text
apps/e_voting/public/videos/bumper.mp4
```

Large media belongs in `public/` so Vite copies it verbatim instead of passing it through the bundler (bundling a large `.mp4` can exhaust the Rolldown allocator). The `<video>` element runs with `autoPlay`, `loop`, `muted`, and `playsInline` (required for mobile browser autoplay).

To use a different clip, either replace `bumper.mp4` or pass a custom `videoSrc` prop (e.g. `/videos/other.mp4`).

## Semantic Tokens Used

- Canvas & Surfaces: `bg-background`, `bg-card`, `border-border`, `border-r`
- Video Overlay: `bg-primary`, `from-primary`, `via-primary/80`, `to-primary/40`
- Foreground on Video: `text-primary-foreground`, `text-primary-foreground/80`, `text-primary-foreground/85`, `border-primary-foreground/20`, `border-primary-foreground/15`, `bg-primary-foreground/10`
- Brand & Accents: `bg-primary`, `text-primary`, `text-primary-foreground`
- Typography: `font-heading`, `font-sans`, `text-foreground`, `text-card-foreground`, `text-muted-foreground`
- Radius: `rounded-xl`, `rounded-full`

## Code Example

```tsx
import AuthLayout from "@/components/layouts/AuthLayout";
import LoginForm from "@/components/organisms/LoginForm";

<AuthLayout
  title="Masuk ke Akun"
  subtitle="Gunakan username dan password yang telah didaftarkan oleh administrator."
  videoSrc="/videos/bumper.mp4"
>
  <LoginForm onSubmit={handleLogin} />
</AuthLayout>;
```
