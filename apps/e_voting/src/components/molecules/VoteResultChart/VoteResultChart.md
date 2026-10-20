# VoteResultChart Component

- **Level**: Molecule
- **Folder**: `src/components/molecules/VoteResultChart/`

## Purpose

Presentational bar chart for per-candidate-pair vote results. Renders a compact column chart plus a legend so vote distribution can be read at a glance without opening a modal.

The leading pair (highest `voteCount`, when greater than zero) is highlighted with `bg-success`; all other bars use `bg-primary`. The chart is display-only and contains no data fetching, so it can be embedded in cards, modals, or result pages.

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `results` | `CandidatePairVoteResult[]` | required | Per-pair result rows (`calon`, `wakil`, `voteCount`, `percentage`). Expected to be sorted by vote count descending by the API. |
| `totalVotes` | `number` | required | Total votes cast, shown in the chart header. |
| `className` | `string` | `""` | Extra classes applied to the outer wrapper. |

## Displayed Information

- Header: chart title and total votes.
- Column chart: one bar per candidate pair, proportional to `percentage`, with the vote count on top and `Paslon {n}` below.
- Legend: pair number, candidate & vice names, vote count, and percentage.
- A zero-vote pair renders no bar height (instead of a misleading minimum bar).

## Semantic Tokens Used

- Surface: `bg-muted/30`, `border-border`
- Text: `text-card-foreground`, `text-foreground`, `text-muted-foreground`
- Bars / legend dots: `bg-primary`, `bg-success` (leader)
- Divider: `border-border`

## Code Example

```tsx
import VoteResultChart from "@/components/molecules/VoteResultChart";

<VoteResultChart
  results={resultData.results}
  totalVotes={resultData.totalVotes}
/>
```
