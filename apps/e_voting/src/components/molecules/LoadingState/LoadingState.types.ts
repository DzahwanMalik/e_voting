type LoadingSpinnerSize = "sm" | "md" | "lg";

interface LoadingStateProps {
  message?: string;
  spinnerSize?: LoadingSpinnerSize;
}

export type { LoadingSpinnerSize, LoadingStateProps };
