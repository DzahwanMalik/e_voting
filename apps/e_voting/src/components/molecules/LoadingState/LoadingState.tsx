import { useEffect, useState } from "react";
import type { LoadingStateProps } from "./LoadingState.types";

const LoadingState = ({
  message = "Memuat",
  textSize = "md",
}: LoadingStateProps) => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <p className={`text-muted-foreground font-medium ${sizeClasses[textSize]}`}>
        {message}
        {".".repeat(dotCount)}
      </p>
    </div>
  );
};

export default LoadingState;
