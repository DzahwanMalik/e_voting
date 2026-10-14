import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Calendar as CalendarIcon, FileText } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/molecules/Select";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import Modal from "@/components/molecules/Modal";
import { toast } from "sonner";
import {
  createCandidatePairApi,
  updateCandidatePairApi,
  getElectionsApi,
  type CreateCandidatePairPayload,
  type ElectionListItem,
} from "@/services/election.service";
import {
  candidatePairFormSchema,
  type CandidatePairFormData,
} from "./CandidatePairFormModal.schema";
import type { CandidatePairFormModalProps } from "./CandidatePairFormModal.types";

interface PhotoUploaderState {
  file: File | null;
  removed: boolean;
}

interface PairPhotoUploaderProps {
  label: string;
  existingUrl: string | null;
  value: PhotoUploaderState;
  onChange: (value: PhotoUploaderState) => void;
  isSubmitting: boolean;
  canDelete: boolean;
}

const PairPhotoUploader = ({
  label,
  existingUrl,
  value,
  onChange,
  isSubmitting,
  canDelete,
}: PairPhotoUploaderProps) => {
  const handleFileChange = (file: File | null) => {
    onChange({ file, removed: false });
  };

  const handleRemovePhoto = () => {
    onChange({ file: null, removed: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <FileUpload
        accept="image/jpeg,image/png,image/gif,image/webp"
        disabled={isSubmitting}
        placeholder="Pilih foto..."
        maxSize={5 * 1024 * 1024} // 5 MB
        onChange={handleFileChange}
      />
      {canDelete && existingUrl && !value.file && !value.removed && (
        <button
          type="button"
          onClick={handleRemovePhoto}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-border text-destructive hover:bg-destructive/10 text-xs font-medium transition-colors w-max"
        >
          Hapus
        </button>
      )}
    </div>
  );
};

const CandidatePairFormModal = ({
  mode,
  pair,
  isOpen,
  onClose,
  onSaved,
}: CandidatePairFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingElections, setIsLoadingElections] = useState(false);
  const [allElections, setAllElections] = useState<ElectionListItem[]>([]);

  const isCreateMode = mode === "create";

  // Election selection (managed outside RHF for <Select> molecule)
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(
    null,
  );

  // Photo states
  const [candidatePhoto, setCandidatePhoto] = useState<PhotoUploaderState>({
    file: null,
    removed: false,
  });
  const [vicePhoto, setVicePhoto] = useState<PhotoUploaderState>({
    file: null,
    removed: false,
  });
  const [pairPhoto, setPairPhoto] = useState<PhotoUploaderState>({
    file: null,
    removed: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CandidatePairFormData>({
    resolver: zodResolver(candidatePairFormSchema),
    mode: "onTouched",
  });

  // Reset form when modal opens or pair changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const setup = () => {
      if (isCreateMode) {
        if (isMounted) {
          reset({
            candidateName: "",
            candidateDescription: "",
            candidateBirthday: "",
            viceName: "",
            viceDescription: "",
            viceBirthday: "",
            vision: "",
            mission: "",
          });
          setSelectedElectionId(null);
        }
      } else if (pair && isMounted) {
        reset({
          candidateName: pair.candidate.name,
          candidateDescription: pair.candidate.description ?? "",
          candidateBirthday: pair.candidate.birthday,
          viceName: pair.vice.name,
          viceDescription: pair.vice.description ?? "",
          viceBirthday: pair.vice.birthday,
          vision: pair.vision,
          mission: pair.mission,
        });
      }

      // Reset photo states
      if (isMounted) {
        setCandidatePhoto({ file: null, removed: false });
        setVicePhoto({ file: null, removed: false });
        setPairPhoto({ file: null, removed: false });
      }
    };

    void setup();
    return () => {
      isMounted = false;
    };
  }, [isOpen, pair, isCreateMode, reset]);

  // Fetch elections when modal opens (for create-mode dropdown)
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadElections = async () => {
      setIsLoadingElections(true);
      try {
        const data = await getElectionsApi();
        if (isMounted) {
          setAllElections(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat daftar pemilihan.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingElections(false);
        }
      }
    };

    void loadElections();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Convert photo state to payload value for API
  const photoToPayload = (
    state: PhotoUploaderState,
  ): File | null | undefined => {
    if (state.file) return state.file;
    if (state.removed) return null;
    return undefined;
  };

  const onValidSubmit = async (data: CandidatePairFormData) => {
    if (isCreateMode && !selectedElectionId) {
      toast.error("Pemilihan wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    try {
      const basePayload = {
        candidateName: data.candidateName.trim(),
        candidateDescription: data.candidateDescription
          ? data.candidateDescription.trim()
          : null,
        candidateBirthday: data.candidateBirthday,
        viceName: data.viceName.trim(),
        viceDescription: data.viceDescription
          ? data.viceDescription.trim()
          : null,
        viceBirthday: data.viceBirthday,
        candidatePhoto: photoToPayload(candidatePhoto),
        vicePhoto: photoToPayload(vicePhoto),
        pairPhoto: photoToPayload(pairPhoto),
        vision: data.vision.trim(),
        mission: data.mission.trim(),
      };

      if (isCreateMode) {
        const createPayload: CreateCandidatePairPayload = {
          ...basePayload,
          electionId: selectedElectionId!,
        };
        await createCandidatePairApi(createPayload);
        toast.success("Paslon kandidat berhasil dibuat.");
      } else if (pair) {
        await updateCandidatePairApi(pair.id, basePayload);
        toast.success("Paslon kandidat berhasil diperbarui.");
      }

      onSaved();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan paslon kandidat.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onValidSubmit)(e);
  };

  const modalTitle = isCreateMode ? "Tambah Paslon" : "Edit Paslon";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title={modalTitle}
      closeButtonDisabled={isSubmitting}
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleFormSubmit} noValidate className="flex flex-1 flex-col">
        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-none space-y-6">
          {/* Election Selection (create mode only) */}
          {isCreateMode && (
            <div className="space-y-3">
              <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Pemilihan
              </h3>
              {isLoadingElections ? (
                <LoadingState
                  message="Memuat daftar pemilihan"
                  textSize="sm"
                />
              ) : allElections.length === 0 ? (
                <EmptyState
                  title="Tidak Ada Pemilihan"
                  description="Tidak ada election yang tersedia untuk dipilih."
                  icon={<CalendarIcon className="w-8 h-8" />}
                />
              ) : (
                <Select
                  value={selectedElectionId}
                  onChange={setSelectedElectionId}
                  options={allElections.map((election) => ({
                    label: election.title,
                    value: election.id,
                  }))}
                  placeholder="Pilih election..."
                  disabled={isSubmitting}
                />
              )}
            </div>
          )}

          {/* Candidate Information */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Calon Utama
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                id="candidateName"
                label="Nama Lengkap"
                required
                error={errors.candidateName?.message}
              >
                <Input
                  id="candidateName"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.candidateName)}
                  placeholder="Masukkan nama calon utama"
                  leftElement={<User className="w-4 h-4" />}
                  {...register("candidateName")}
                />
              </FormField>

              <FormField
                id="candidateBirthday"
                label="Tanggal Lahir"
                required
                error={errors.candidateBirthday?.message}
              >
                <Input
                  id="candidateBirthday"
                  type="date"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.candidateBirthday)}
                  leftElement={<CalendarIcon className="w-4 h-4" />}
                  {...register("candidateBirthday")}
                />
              </FormField>

              <FormField
                id="candidateDescription"
                label="Deskripsi"
                optional
                error={errors.candidateDescription?.message}
              >
                <Input
                  id="candidateDescription"
                  type="text"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.candidateDescription)}
                  placeholder="Deskripsi singkat (opsional)"
                  {...register("candidateDescription")}
                />
              </FormField>

              <PairPhotoUploader
                label="Foto Calon"
                existingUrl={pair?.candidate.photoUrl ?? null}
                value={candidatePhoto}
                onChange={setCandidatePhoto}
                isSubmitting={isSubmitting}
                canDelete={!isCreateMode}
              />
            </div>
          </div>

          {/* Vice Information */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Wakil Calon
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                id="viceName"
                label="Nama Lengkap"
                required
                error={errors.viceName?.message}
              >
                <Input
                  id="viceName"
                  type="text"
                  autoComplete="name"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.viceName)}
                  placeholder="Masukkan nama wakil calon"
                  leftElement={<User className="w-4 h-4" />}
                  {...register("viceName")}
                />
              </FormField>

              <FormField
                id="viceBirthday"
                label="Tanggal Lahir"
                required
                error={errors.viceBirthday?.message}
              >
                <Input
                  id="viceBirthday"
                  type="date"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.viceBirthday)}
                  leftElement={<CalendarIcon className="w-4 h-4" />}
                  {...register("viceBirthday")}
                />
              </FormField>

              <FormField
                id="viceDescription"
                label="Deskripsi"
                optional
                error={errors.viceDescription?.message}
              >
                <Input
                  id="viceDescription"
                  type="text"
                  disabled={isSubmitting}
                  isInvalid={Boolean(errors.viceDescription)}
                  placeholder="Deskripsi singkat (opsional)"
                  {...register("viceDescription")}
                />
              </FormField>

              <PairPhotoUploader
                label="Foto Wakil"
                existingUrl={pair?.vice.photoUrl ?? null}
                value={vicePhoto}
                onChange={setVicePhoto}
                isSubmitting={isSubmitting}
                canDelete={!isCreateMode}
              />
            </div>
          </div>

          {/* Pair Photo */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Foto Pasangan
            </h3>
            <p className="text-xs text-muted-foreground">
              Foto kampanye bersama calon + wakil (opsional).
            </p>

            <PairPhotoUploader
              label="Foto Pasangan"
              existingUrl={pair?.photoUrl ?? null}
              value={pairPhoto}
              onChange={setPairPhoto}
              isSubmitting={isSubmitting}
              canDelete={!isCreateMode}
            />
          </div>

          {/* Vision & Mission */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Visi dan Misi
            </h3>

            <FormField
              id="vision"
              label="Visi"
              required
              error={errors.vision?.message}
            >
              <Textarea
                id="vision"
                rows={3}
                disabled={isSubmitting}
                isInvalid={Boolean(errors.vision)}
                placeholder="Masukkan visi paslon..."
                {...register("vision")}
              />
            </FormField>

            <FormField
              id="mission"
              label="Misi"
              required
              error={errors.mission?.message}
            >
              <Textarea
                id="mission"
                rows={4}
                disabled={isSubmitting}
                isInvalid={Boolean(errors.mission)}
                placeholder="Masukkan misi paslon..."
                {...register("mission")}
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
            disabled={isSubmitting || isLoadingElections}
            icon={<FileText className="w-4 h-4" />}
          >
            {isCreateMode ? "Simpan" : "Perbarui"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CandidatePairFormModal;
