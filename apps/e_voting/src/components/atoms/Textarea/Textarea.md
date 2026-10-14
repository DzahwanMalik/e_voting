# Textarea Component

- **Level**: Atom
- **Folder**: `src/components/atoms/Textarea/`

## Purpose

The `Textarea` component is the multi-line text primitive, serving as the
semantic-token-aligned counterpart to the `Input` atom. Unlike a plain
`<textarea>`, it is **auto-expanding** — its height is driven by its content via
the native CSS `field-sizing: content` property, so it grows and shrinks as text
is added or removed and presents **no vertical scrollbar** while the content fits.
Manual drag-resize is disabled (`resize-none`); height is the only thing driven
by the field's content.

It is compatible with `react-hook-form`'s `register()` because it forwards
`ref` as a plain **React 19 prop** directly to the underlying `<textarea>` (no
internal ref or measurement logic is required).

## Props

| Prop        | Type     | Default | Description                                                                                  |
| :---------- | :------- | :------ | :------------------------------------------------------------------------------------------- |
| `isInvalid` | `boolean`| `false` | Renders the destructive token set (red border, destructive focus ring, destructive text).  |
| `className` | `string` | `""`    | Consumer-level class extension (appended after the base token classes).                     |
| `rows`      | `number` | `4`     | Fallback minimum height (in line boxes) for browsers without `field-sizing` support.       |

All standard `TextareaHTMLAttributes<HTMLTextAreaElement>` are inherited
(`placeholder`, `disabled`, `id`, `name`, `onBlur`, `register(...)` spread, etc.).

## Behavior — Auto-Resize (CSS-only, no JavaScript)

The auto-expansion is achieved entirely with CSS — there is no
`ResizeObserver`, no `scrollHeight` polling, and no `input`/`change` listeners.

1. **Native content sizing** — `[field-sizing:content]` (the CSS property
   `field-sizing: content`) makes the textarea size its block axis to its
   rendered content. Because the browser's own layout engine owns the height,
   the measurement is always accurate and race-free for typing, paste, cut, and
   drop alike. React 19 concurrent rendering cannot make it "racy" the way a
   JS `scrollHeight` read could, because no JS is involved at all.

2. **Minimum height floor** — `min-block-size` (derived from the `rows` prop,
   e.g. `rows={4}` -> `[min-block-size:4lh]`) gives the empty field a sensible
   height so it does not collapse to the placeholder height. Per MDN, `min-*`
   constraints are safe alongside `field-sizing: content` and do **not**
   reimpose a fixed size.

3. **`rows` as progressive enhancement** — the `rows` attribute is still
   rendered so that browsers without `field-sizing` support (older engine
   versions) degrade to a fixed-height field. Per the spec, `rows`/`cols` have
   no effect on the sizing of a `field-sizing: content` textarea, so modern
   browsers simply ignore it.

4. **Sizing constraints** — per the CSS Form Control Styling spec, an explicit
   fixed `width`/`height` *would* override `field-sizing: content`, so the atom
   avoids any `h-*` utility and uses `width: 100%` (`w-full`), a percentage that
   keeps the field full-width and stable without preventing vertical growth.

5. **Overflow handling** — `resize-none overflow-y-auto`: the field expands to
   fit its content, so no scrollbar appears while content fits. The surrounding
   (modal body) scroller absorbs overflow for pathologically long content;
   `overflow-y-auto` is used instead of `overflow-y-hidden` so that any overflow
   beyond the available space remains scrollable rather than clipped.

### Why not `requestAnimationFrame` / `scrollHeight`

The earlier implementation read `scrollHeight` inside a
`requestAnimationFrame` triggered from a synthetic `onChange`. That was racy
under React 19 concurrent rendering: fast keystrokes could be measured against a
committed-but-not-flushed layout, so typing did not expand (while a single large
paste did). Replacing it with `field-sizing: content` removes the entire
measurement surface — the browser is now the single source of truth for height.

## Semantic Tokens Used

Mirrors the `Input` atom's token mapping:

- Base: `bg-card`, `text-foreground`, `placeholder:text-muted-foreground`
- Border: `border-input`, `hover:border-border-hover`
- Focus: `focus:border-primary`, `focus:ring-primary`
- Error: `border-destructive`, `text-destructive`, `focus:ring-destructive`
- Disabled: `bg-muted`, `opacity-70`, `cursor-not-allowed`
- Radius: `rounded-xl` (8px — Inputs & Controls scale)
- Padding: `px-3.5 py-2.5`

## Code Example

```tsx
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";

<FormField
  id="description"
  label="Deskripsi"
  optional
  error={errors.description?.message}
>
  <Textarea
    id="description"
    rows={4}
    disabled={isSubmitting}
    isInvalid={Boolean(errors.description)}
    placeholder="Masukkan deskripsi pemilihan (opsional)"
    {...register("description")}
  />
</FormField>
```
