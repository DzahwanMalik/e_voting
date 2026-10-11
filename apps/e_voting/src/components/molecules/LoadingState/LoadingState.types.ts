type LoadingTextSize = "sm" | "md" | "lg";

interface LoadingStateProps {
  message?: string;
  textSize?: LoadingTextSize;
}

export type { LoadingTextSize, LoadingStateProps };
