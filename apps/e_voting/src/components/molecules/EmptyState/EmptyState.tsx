import { Layers } from "lucide-react";
import type { EmptyStateProps } from "./EmptyState.types";

const EmptyState = ({ title = "Tidak Ada Data", description = "Tidak ada data untuk ditampilkan saat ini.", icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
        {icon || <Layers className="w-8 h-8" />}
      </div>
      <div className="space-y-1 max-w-md">
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
