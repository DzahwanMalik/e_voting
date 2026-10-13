import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/AuthLayout";
import LoginForm, { type LoginCredentials } from "@/components/organisms/LoginForm";
import { loginApi } from "@/services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const response = await loginApi(credentials);
      toast.success(response.message || "Login berhasil!");

      // Navigate directly to respective landing page according to PRD roles
      if (response.user.role === "VOTER") {
        navigate("/voter/dashboard");
      } else {
        navigate("/admin/elections");
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
      <LoginForm
        isLoading={isLoading}
        onSubmit={handleLoginSubmit}
      />
    </AuthLayout>
  );
};

export default LoginPage;
