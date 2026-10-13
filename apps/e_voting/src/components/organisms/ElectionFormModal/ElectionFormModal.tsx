import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Edit2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import { toast } from "sonner";
import {
  createElectionApi,
  updateElectionApi,
} from "@/services/election.service";
import { electionFormSchema, type ElectionFormData } from "./ElectionFormModal.schema";
import type { ElectionFormModalProps } from "./ElectionFormModal.types";

const ElectionFormModal = ({
  mode,
  election,
  isOpen,
  onClose,
  onSaved,
}: ElectionFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreateMode = mode === "create";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ElectionFormData>({
    resolver: zodResolver(electionFormSchema),
    mode: "onTouched",
  });

  // Reset form when modal opens or election changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    if (isCreateMode) {
      if (isMounted) {
        reset({
          title: "",
          description: null,
        });
      }
    } else if (election && isMounted) {
      reset({
        title: election.title,
        description: election.description ?? null,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, election, isCreateMode, reset]);

  const onValidSubmit = async (data: ElectionFormData) => {
    const trimmedTitle = data.title.trim();
    const trimmedDescription =
      data.description && data.description.trim().length > 0
        ? data.description.trim()
        : null;

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        await createElectionApi({
          title: trimmedTitle,
          description: trimmedDescription,
        });
        toast.success("Pemilihan berhasil dibuat.");
      } else if (election) {
        await updateElectionApi(election.id, {
          title: trimmedTitle,
          description: trimmedDescription,
        });
        toast.success("Pemilihan berhasil diperbarui.");
      }
      onSaved();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pemilihan.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isCreateMode ? "Tambah Pemilihan" : "Edit Pemilihan";

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onValidSubmit)(e);
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
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="flex flex-1 flex-col"
      >
        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Election Information */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Informasi Pemilihan
            </h3>

            <FormField
              id="title"
              label="Judul"
              required
              error={errors.title?.message}
            >
              <Input
                id="title"
                type="text"
                autoComplete="off"
                autoFocus
                disabled={isSubmitting}
                isInvalid={Boolean(errors.title)}
                placeholder="Masukkan judul pemilihan"
                leftElement={<FileText className="w-4 h-4" />}
                {...register("title")}
              />
            </FormField>

            <FormField
              id="description"
              label="Deskripsi"
              optional
              error={errors.description?.message}
              hint="Deskripsi singkat tentang pemilihan ini. (opsional)"
            >
              <textarea
                id="description"
                rows={4}
                disabled={isSubmitting}
                placeholder="Masukkan deskripsi pemilihan (opsional)"
                className={`w-full bg-card text-foreground placeholder:text-muted-foreground text-sm rounded-xl transition-all duration-150 border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-opacity-20 resize-y ${
                  errors.description
                    ? "border-destructive text-destructive focus:ring-destructive focus:border-destructive"
                    : "border-input hover:border-border-hover focus:border-primary focus:ring-primary"
                }`}
                {...register("description")}
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
            icon={
              isCreateMode ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Edit2 className="w-4 h-4" />
              )
            }
          >
            {isCreateMode ? "Simpan" : "Perbarui"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ElectionFormModal;
