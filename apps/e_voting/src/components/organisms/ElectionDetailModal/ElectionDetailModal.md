# ElectionDetailModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ElectionDetailModal/`

## Purpose
Modal dialog for viewing election details (title, description, candidate pair/voter/admin counts, timeline, and optional lists). Accessible via the Election page card "Lihat Detail" button for both Admin and Super Admin roles.

This modal is read-only. **Import Voter has been moved out of this modal** and is now triggered directly from the election card (`AdminElectionCard` → `ImportVotersModal`).

## Props
- `election`: `ElectionListItem | null` - The election to display. When `null`, the modal renders nothing.
- `isOpen`: `boolean` - Modal open state.
- `onClose`: `() => void` - Modal dismissal handler.

## Internal Usage
Composes the base `<Modal>` molecule (size `"2xl"`) with `title="Detail Pemilihan"`, the `<StatCard>` molecule for summary stat cards (candidate pair/voter/admin counts), and the `<Button>` atom for the footer close button.

## API Integration
Uses the `ElectionListItem` type which includes `_count` aggregations and optional `candidatePairs`, `electionAdmins`, and `electionVoters` arrays from the `getElectionsApi()` response. No additional API calls are needed.

## Sections
- **Summary Stats**: candidate pair count (`Layers` icon), voter count (`Users` icon), admin count (`Shield` icon)
- **Timeline**: created and updated timestamps
- **Candidate Pairs List**: rendered if `election.candidatePairs` is available (shows calon + wakil names)
- **Admins List**: rendered if `election.electionAdmins` is available

## Code Example
```tsx
import ElectionDetailModal from "@/components/organisms/ElectionDetailModal";

<ElectionDetailModal
  election={selectedElection}
  isOpen={detailElection !== null}
  onClose={() => setDetailElection(null)}
/>
```