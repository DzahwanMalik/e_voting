import { useNavigate } from "react-router";
import { Wrench } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { ComingSoonPageProps } from "./ComingSoonPage.types";

const ComingSoonPage = ({
  title,
  description,
  icon,
}: ComingSoonPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {description ||
            "Fitur ini sedang dalam pengembangan oleh tim pengembang."}
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          {icon || <Wrench className="w-8 h-8" />}
        </div>
        <h2 className="font-sans text-lg font-bold text-card-foreground">
          Fitur akan datang
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {title} sedang dalam pengembangan. Silakan kunjungi kembali nanti atau
          hubungi administrator sistem.
        </p>
        <Button variant="outline" onClick={() => navigate("/admin/elections")}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
