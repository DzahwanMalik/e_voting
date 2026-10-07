import type { LoadingStateProps } from "./LoadingState.types";

const spinnerClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-10 h-10 border-3",
};

const LoadingState = ({
  message = "Memuat...",
  spinnerSize = "md",
}: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${spinnerClasses[spinnerSize]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
