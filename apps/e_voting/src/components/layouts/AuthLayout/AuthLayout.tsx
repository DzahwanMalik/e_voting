import { Vote, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import type { AuthLayoutProps } from "./AuthLayout.types";

const AuthLayout = ({
  children,
  title = "E-Voting",
  subtitle = "Sistem Pemungutan Suara Digital",
  badgeText = "MVP v0.1.0",
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative selection:bg-secondary selection:text-secondary-foreground font-sans">
      {/* Subtle Ambient Decorative Circles */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 pointer-events-none opacity-40 blur-3xl overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-96 h-96 bg-primary/10 rounded-full mx-auto -translate-y-1/2" />
      </div>

      {/* Top Spacer / Minimal Navigation bar anchor */}
      <header className="w-full max-w-md flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Vote className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground tracking-tight">
            E-Voting
          </span>
        </div>
        {badgeText && (
          <Badge variant="secondary" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            {badgeText}
          </Badge>
        )}
      </header>

      {/* Centered Auth Card Container */}
      <main className="w-full max-w-md my-auto py-6 z-10">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8 backdrop-blur-xs transition-shadow duration-200">
          {/* Header section inside Card */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground border border-border mb-4">
              <Vote className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center py-4 z-10">
        <p className="text-xs text-muted-foreground">
          E-Voting System &bull; Hak Akses Berbasis Peran &amp; Cakupan
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
