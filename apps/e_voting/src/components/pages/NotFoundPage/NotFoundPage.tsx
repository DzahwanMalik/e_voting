import { useNavigate } from "react-router";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useUserStore } from "@/stores/useUserStore";
import { getAuthToken } from "@/services/auth.service";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = useUserStore((state) => state.user);

  const isAuthenticated = Boolean(token && user);

  const handleReturnHome = () => {
    if (isAuthenticated) {
      if (user?.role === "VOTER") {
        navigate("/voter/dashboard");
      } else {
         navigate("/admin/elections");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative selection:bg-secondary selection:text-secondary-foreground font-sans">
      {/* Decorative ambient background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 pointer-events-none opacity-40 blur-3xl overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-96 h-96 bg-primary/10 rounded-full mx-auto -translate-y-1/2" />
      </div>

      <header className="w-full max-w-md py-4 z-10 flex items-center justify-between">
        <span className="font-heading font-bold text-lg text-foreground tracking-tight">
          E-Voting
        </span>
        <Badge variant="warning">Error 404</Badge>
      </header>

      {/* Main 404 Card */}
      <main className="w-full max-w-md my-auto py-6 z-10">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-7 sm:p-10 text-center space-y-6 backdrop-blur-xs">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-secondary-foreground border border-border">
            <FileQuestion className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              404
            </h1>
            <h2 className="font-sans text-lg font-semibold text-foreground">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Tautan yang Anda tuju tidak tersedia, telah dihapus, atau Anda tidak memiliki akses ke alamat tersebut.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleReturnHome}
              icon={isAuthenticated ? <Home className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            >
               {isAuthenticated ? "Kembali ke Beranda" : "Kembali ke Halaman Login"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-md text-center py-4 z-10">
        <p className="text-xs text-muted-foreground">
          E-Voting System &bull; MVP v0.1.0
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;

