import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import { toast } from "sonner";
import {
  createAdminApi,
  updateAdminApi,
  type CreateAdminPayload,
  type UpdateAdminPayload,
} from "@/services/user.service";
import { adminFormSchema, type AdminFormData } from "./AdminFormModal.schema";
import type { AdminFormModalProps } from "./AdminFormModal.types";

const AdminFormModal = ({
  mode,
  admin,
  isOpen,
  onClose,
  onSaved,
}: AdminFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreateMode = mode === "create";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    mode: "onTouched",
  });

  // Reset form when modal opens or admin changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    if (isCreateMode) {
      if (isMounted) {
        reset({
          username: "",
          name: "",
          password: "",
        });
      }
    } else if (admin && isMounted) {
      reset({
        username: admin.username,
        name: admin.name ?? "",
        password: "",
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, admin, isCreateMode, reset]);

  const handleFormSubmit = async (data: AdminFormData) => {
    const trimmedUsername = data.username.trim();
    const trimmedName = data.name.trim();

    if (isCreateMode && !data.password) {
      toast.error("Password wajib diisi untuk admin baru.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        const payload: CreateAdminPayload = {
          username: trimmedUsername,
          password: data.password!,
          name: trimmedName,
        };

        await createAdminApi(payload);
        toast.success("Admin berhasil dibuat.");
      } else if (admin) {
        const payload: UpdateAdminPayload = {
          username: trimmedUsername,
          name: trimmedName,
        };

        if (data.password) {
          payload.password = data.password;
        }

        await updateAdminApi(admin.id, payload);
        toast.success("Admin berhasil diperbarui.");
      }
      onSaved();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan admin.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isCreateMode ? "Tambah Admin" : "Edit Admin";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(handleFormSubmit)(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={modalTitle}
      closeButtonDisabled={isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Admin Information */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Informasi Admin
            </h3>

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
                disabled={isSubmitting}
                isInvalid={Boolean(errors.username)}
                placeholder="Masukkan username"
                leftElement={<User className="w-4 h-4" />}
                {...register("username")}
              />
            </FormField>

            <FormField
              id="name"
              label="Nama Lengkap"
              required
              error={errors.name?.message}
            >
              <Input
                id="name"
                type="text"
                autoComplete="name"
                disabled={isSubmitting}
                isInvalid={Boolean(errors.name)}
                placeholder="Masukkan nama lengkap"
                leftElement={<User className="w-4 h-4" />}
                {...register("name")}
              />
            </FormField>

            <FormField
              id="password"
              label={isCreateMode ? "Password" : "Password Baru"}
              required={isCreateMode}
              optional={!isCreateMode}
              error={errors.password?.message}
              hint={
                !isCreateMode
                  ? "Kosongkan jika tidak ingin mengganti password."
                  : undefined
              }
            >
              <Input
                id="password"
                type="password"
                autoComplete={
                  isCreateMode ? "new-password" : "current-password"
                }
                disabled={isSubmitting}
                isInvalid={Boolean(errors.password)}
                placeholder={
                  isCreateMode
                    ? "Masukkan password (minimal 1 karakter)"
                    : "Masukkan password baru (opsional)"
                }
                leftElement={<Lock className="w-4 h-4" />}
                {...register("password")}
              />
            </FormField>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            {isCreateMode ? "Simpan" : "Perbarui"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminFormModal;
