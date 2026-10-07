import { Layers } from "lucide-react";
import type { EmptyStateProps } from "./EmptyState.types";

const EmptyState = ({
  title = "Tidak Ada Data",
  description = "Tidak ada data untuk ditampilkan saat ini.",
  icon,
}: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
        {icon || <Layers className="w-8 h-8" />}
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h2 className="font-sans text-lg font-bold text-card-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
