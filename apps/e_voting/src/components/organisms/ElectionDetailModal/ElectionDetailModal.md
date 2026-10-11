# ElectionDetailModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ElectionDetailModal/`

## Purpose

Modal dialog for viewing election details (title, description, candidate/voter/admin counts, timeline, and optional lists). Accessible via the Election page datatable "Lihat Detail" row option for both Admin and Super Admin roles.

Composes the base `<Modal>` molecule (size `"2xl"`) with `title="Detail Pemilihan"`, the `<StatCard>` molecule for summary stat cards (candidate/voter/admin counts), and the `<Button>` atom for the footer close button.

## Props

| Prop | Tipe | Deskripsi |
|---|---|---|
| `election` | `ElectionListItem \| null` | Election data object |
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback to close the modal |

## Data Source

Uses the `ElectionListItem` type which includes `_count` aggregations and optional `candidates`, `electionAdmins`, and `electionVoters` arrays from the `getElectionsApi()` response. No additional API calls are needed.

## Displayed Data

- **Election Info**: title, description
- **Summary Stats**: candidate count (`Layers` icon), voter count (`Users` icon), admin count (`Shield` icon)
- **Timeline**: created date (`Calendar` icon), updated date (`Clock` icon)
- **Candidates List**: rendered if `election.candidates` is available
- **Admins List**: rendered if `election.electionAdmins` is available

## Code Example

```tsx
import ElectionDetailModal from "@/components/organisms/ElectionDetailModal";

<ElectionDetailModal
  election={selectedElection}
  isOpen={isDetailOpen}
  onClose={() => setIsDetailOpen(false)}
/>
```
