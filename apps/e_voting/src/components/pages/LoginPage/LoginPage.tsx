import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { LoginForm, type LoginCredentials } from "@/components/organisms/LoginForm";
import { loginApi } from "@/services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Quick-select prefilled credentials matching database seed
  const [demoCreds, setDemoCreds] = useState<LoginCredentials | null>(null);

  const handleQuickFill = (role: "Super Admin" | "Admin" | "Voter") => {
    if (role === "Super Admin") {
      setDemoCreds({ username: "superadmin", password: "superadmin123" });
    } else if (role === "Admin") {
      setDemoCreds({ username: "admin", password: "admin123" });
    } else {
      setDemoCreds({ username: "andi", password: "andi123" });
    }
  };

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const response = await loginApi(credentials);
      toast.success(response.message || "Login berhasil!");

      // Navigate directly to respective dashboard according to PRD roles
      if (response.user.role === "VOTER") {
        navigate("/voter/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal melakukan autentikasi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Akun"
      subtitle="Gunakan username dan password yang telah didaftarkan oleh administrator."
      badgeText="MVP v0.1.0"
    >
      <div className="space-y-6">
        {/* Quick Demo Role Fillers for ease of UX testing */}
        <div className="space-y-2 pb-1 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Uji Peran Cepat (Seed Database):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill("Super Admin")}
              className="px-2.5 py-1 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors font-medium cursor-pointer"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("Admin")}
              className="px-2.5 py-1 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors font-medium cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("Voter")}
              className="px-2.5 py-1 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors font-medium cursor-pointer"
            >
              Voter (Andi)
            </button>
          </div>
        </div>

        {/* Core LoginForm Organism */}
        <LoginForm
          key={demoCreds ? `${demoCreds.username}-${demoCreds.password}` : "empty"}
          initialUsername={demoCreds?.username ?? ""}
          initialPassword={demoCreds?.password ?? ""}
          isLoading={isLoading}
          onSubmit={handleLoginSubmit}
        />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
