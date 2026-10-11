# SectionCard Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/SectionCard/`

## Purpose

A standardized card container wrapper that provides a consistent `bg-card`, `border-border`, `rounded-3xl`, and `shadow-sm` shell with optional header, body, and footer sections. The card's interior content is entirely provided by the consuming parent component as `children` — this component itself never handles domain-specific content.

It is the card-level equivalent of the `<Modal>` wrapper pattern: the parent controls all content rendering while SectionCard handles the structural container.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `title` | `ReactNode` | — | Optional header title. Ignored when `header` is provided. |
| `subtitle` | `ReactNode` | — | Optional header subtitle text. Ignored when `header` is provided. |
| `header` | `ReactNode` | — | Custom header content. Takes precedence over `title`/`subtitle`. |
| `footer` | `ReactNode` | — | Optional footer bar content (e.g., action buttons). |
| `padding` | `"default"` \| `"none"` | `"default"` | Body padding variant. `default` = `p-6`, `none` = no padding. |
| `className` | `string` | `""` | Additional classes for the container. Extends `HTMLAttributes<HTMLDivElement>`. |
| `children` | `ReactNode` | — | Body content provided by the parent. |

## Semantic Tokens Used

- Container: `bg-card`, `text-card-foreground`, `border-border`
- Shadow: `shadow-sm`
- Header border: `border-border`
- Footer background: `bg-muted/30`
- Footer border: `border-border`

## Code Example

```tsx
import SectionCard from "@/components/molecules/SectionCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

<SectionCard
  title="Daftar Pemilihan"
  subtitle="Kelola semua pemilihan yang Anda tangani"
  footer={
    <div className="flex items-center justify-end gap-3">
      <Button variant="outline" size="sm">Batal</Button>
      <Button variant="primary" size="sm">Simpan</Button>
    </div>
  }
>
  {/* Parent provides the actual card content */}
  <div className="space-y-4">
    {elections.map((e) => (
      <div key={e.id} className="flex items-center justify-between">
        <span className="font-medium text-foreground">{e.title}</span>
        <Badge variant="info">{e.status}</Badge>
      </div>
    ))}
  </div>
</SectionCard>
```

### Custom Header Variant

```tsx
<SectionCard
  header={
    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
      <h2 className="font-sans text-xl font-bold text-card-foreground">Custom Header</h2>
      <Badge variant="warning">Draft</Badge>
    </div>
  }
>
  <div className="p-6">
    <p>Content with custom header layout.</p>
  </div>
</SectionCard>
```
