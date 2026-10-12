# VoterDetailModal

- **Level**: Organism
- **Folder**: `src/components/organisms/VoterDetailModal/`

## Purpose

Dialog modal displaying complete voter details. Wraps the `<Modal>` molecule. Provides a read-only overview of a voter's identity, creator, election enrollments, and voting status. Accessible via the Voter page datatable "Lihat Detail" row option (both Admin and Super Admin per BR-08 scope).

Per PRD Section 15.4 (Voter Management) and BR-07/BR-08:

- Shows which elections the voter is enrolled in and their voting status (`hasVoted`).
- Displays the creator (Super Admin or Admin) who registered the voter, enforcing transparency around BR-08 (Admin Voter Scope).

## Props

| Prop | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `voter` | `VoterListItem \| null` | Voter data to display; returns `null` (no DOM) if `null` |
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Dismiss callback |

## Layout Sections

| Section | Component | Pattern |
| :--- | :--- | :--- |
| Voter Info | Custom div with avatar initials | Name, username, role badge |
| Summary Stats | `<StatCard>` x3 | Election count, voted count, not-voted count |
| Creator | Custom div with `<Shield>` icon | Creator name, username, role badge |
| Election Assignments | Mapped list | Each election with voting status badge |
| Timeline | Custom div with `<Calendar>` / `<Clock>` icons | Created at, updated at |
| Footer | `<Button>` | Close button |

## Dependencies

- Atoms: `Badge`, `Button`
- Molecules: `Modal`, `StatCard`
- Utilities: `formatDate` (from `@/lib/utils`)
- Icons: `Calendar`, `Clock`, `Users`, `Shield`, `Vote` (from `lucide-react`)

## Semantic Tokens Used

- Modal container: `bg-card`, `border-border`, `rounded-3xl`, `shadow-xl`
- Avatar: `bg-primary/10`, `text-primary`, `border-border`
- Text: `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- Election row: `border-border`
- Status badges: `bg-success-subtle` / `bg-pending-subtle`

## Code Example

```tsx
import VoterDetailModal from "@/components/organisms/VoterDetailModal";

<VoterDetailModal
  voter={selectedVoter}
  isOpen={detailOpen}
  onClose={() => setDetailOpen(false)}
/>
```
