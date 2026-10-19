# ResetVotingModal Component

- **Level**: Organism
- **Folder**: `src/components/organisms/ResetVotingModal/`

## Purpose

Confirmation dialog for the destructive **Reset Data Voting** action (PRD BR-18). Explains the impact of the operation and requires the Super Admin to type `RESET` before the destructive button becomes enabled. The modal cannot be dismissed while the reset request is in progress.

## Props

- `isOpen`: `boolean` — controls modal visibility.
- `onClose`: `() => void` — dismissal callback.
- `onConfirm`: `() => Promise<void> | void` — reset handler; invoked only when confirmation text matches.
- `isSubmitting`: `boolean` (optional, default `false`) — loading state while the reset request runs.

## Behavior

- The page mounts this modal only while it is open, so the confirmation input starts empty on every open.
- The destructive button stays disabled until the trimmed input equals `RESET`.
- While `isSubmitting` is `true`, the close button, backdrop click, escape key, and cancel button are disabled.
- Composes `Modal`, `Label`, `Input`, and `Button`; no API call is made inside this organism (the page owns the request).

## Semantic Tokens Used

- Warning surface: `border-destructive/30`, `bg-destructive/5`, `text-destructive`
- Modal surface: `bg-card`, `border-border`, `bg-muted/30`
- Text: `text-foreground`, `text-muted-foreground`
- Button: `variant="destructive"` (`bg-destructive`, `text-destructive-foreground`)

## Code Example

```tsx
import ResetVotingModal from "@/components/organisms/ResetVotingModal";

<ResetVotingModal
  isOpen={isResetModalOpen}
  isSubmitting={isResetting}
  onClose={() => setIsResetModalOpen(false)}
  onConfirm={handleResetVoting}
/>;
```
