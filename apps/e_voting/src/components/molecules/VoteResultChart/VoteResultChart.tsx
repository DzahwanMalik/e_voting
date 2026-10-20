import { BarChart3 } from "lucide-react";
import type { VoteResultChartProps } from "./VoteResultChart.types";

const VoteResultChart = ({
  results,
  totalVotes,
  className = "",
}: VoteResultChartProps) => {
  const maxVotes = results.reduce(
    (max, result) => Math.max(max, result.voteCount),
    0,
  );

  const isLeadingResult = (voteCount: number): boolean =>
    maxVotes > 0 && voteCount === maxVotes;

  const getBarClasses = (voteCount: number): string =>
    isLeadingResult(voteCount) ? "bg-success" : "bg-primary";

  const getBarHeight = (voteCount: number, percentage: number): string => {
    if (voteCount <= 0) return "0%";
    return `${Math.max(percentage, 2)}%`;
  };

  return (
    <div
      className={`rounded-xl border border-border bg-muted/30 p-3.5 ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-card-foreground">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Perolehan Suara</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalVotes} total suara
        </span>
      </div>

      <div
        className="mt-4 flex items-end gap-2 sm:gap-3"
        role="img"
        aria-label="Grafik perolehan suara paslon"
      >
        {results.map((result, index) => (
          <div
            key={result.candidatePairId}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <span className="text-xs font-semibold text-foreground">
              {result.voteCount}
            </span>
            <div className="flex h-24 w-full items-end justify-center">
              <div
                className={`w-full max-w-10 rounded-t-lg transition-all duration-300 ${getBarClasses(
                  result.voteCount,
                )}`}
                style={{
                  height: getBarHeight(result.voteCount, result.percentage),
                }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              Paslon {index + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1.5 border-t border-border pt-3">
        {results.map((result, index) => (
          <div
            key={result.candidatePairId}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${getBarClasses(
                  result.voteCount,
                )}`}
              />
              <span className="truncate text-muted-foreground">
                <span className="font-medium text-foreground">
                  Paslon {index + 1}
                </span>{" "}
                · {result.calon.name} &amp; {result.wakil.name}
              </span>
            </div>
            <span className="shrink-0 font-medium text-foreground">
              {result.voteCount} ({result.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteResultChart;
