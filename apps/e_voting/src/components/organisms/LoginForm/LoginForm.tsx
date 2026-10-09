import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Eye, EyeOff, LogIn, Info } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import { loginSchema, type LoginFormData } from "./LoginForm.schema";
import type { LoginFormProps } from "./LoginForm.types";

const LoginForm = ({
  onSubmit,
  isLoading = false,
  initialUsername = "",
  initialPassword = "",
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: initialUsername,
      password: initialPassword,
    },
    values: {
      username: initialUsername,
      password: initialPassword,
    },
    mode: "onTouched",
  });

  const onValidSubmit = async (data: LoginFormData) => {
    if (onSubmit) {
      await onSubmit({
        username: data.username.trim(),
        password: data.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-5">
      {/* Username Field */}
      <FormField
        id="username"
        label="Username"
        required
        error={errors.username?.message}
      >
        <Input
          id="username"
          type="text"
          autoComplete="username"
          autoFocus
          disabled={isLoading}
          isInvalid={Boolean(errors.username)}
          placeholder="Masukkan username"
          leftElement={<User className="w-4 h-4" />}
          {...register("username")}
        />
      </FormField>

      {/* Password Field */}
      <FormField
        id="password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={isLoading}
          isInvalid={Boolean(errors.password)}
          placeholder="Masukkan password"
          leftElement={<Lock className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...register("password")}
        />
      </FormField>

      {/* Notice on Account Creation (PRD Compliance) */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted border border-border text-muted-foreground text-xs leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <span>
          Akses masuk tersedia untuk <strong>Super Admin</strong>, <strong>Admin</strong>, dan <strong>Voter</strong>.
          Pendaftaran akun hanya dapat dilakukan oleh administrator berwenang.
        </span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        icon={<LogIn className="w-4 h-4" />}
      >
        {isLoading ? "Memproses Masuk..." : "Masuk ke Sistem"}
      </Button>
    </form>
  );
};

export default LoginForm;

