import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Calendar as CalendarIcon, FileText, Layers } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/molecules/Select";
import DatePicker from "@/components/molecules/DatePicker";
import FormField from "@/components/molecules/FormField";
import ImageUpload, {
  type ImageUploadValue,
} from "@/components/molecules/ImageUpload";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import Modal from "@/components/molecules/Modal";
import { toDateInputValue } from "@/lib/utils";
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
  const [candidatePhoto, setCandidatePhoto] = useState<ImageUploadValue>({
    file: null,
    removed: false,
  });
  const [vicePhoto, setVicePhoto] = useState<ImageUploadValue>({
    file: null,
    removed: false,
  });
  const [pairPhoto, setPairPhoto] = useState<ImageUploadValue>({
    file: null,
    removed: false,
  });

  const {
    register,
    control,
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
          candidateBirthday: toDateInputValue(pair.candidate.birthday),
          viceName: pair.vice.name,
          viceDescription: pair.vice.description ?? "",
          viceBirthday: toDateInputValue(pair.vice.birthday),
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

  // Fetch elections only for the create-mode dropdown.
  // Edit mode already knows the election from the pair row and cannot move it.
  useEffect(() => {
    if (!isOpen || !isCreateMode) return;

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
  }, [isOpen, isCreateMode]);

  // Convert photo state to payload value for API
  const photoToPayload = (
    state: ImageUploadValue,
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
          {/* Election: selectable on create, read-only on edit */}
          <div className="space-y-3">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Pemilihan
            </h3>
            {isCreateMode ? (
              isLoadingElections ? (
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
              )
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-foreground truncate">
                    {pair?.election?.title ?? "Pemilihan terkait"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pemilihan tidak dapat diubah saat mengedit paslon.
                  </p>
                </div>
              </div>
            )}
          </div>

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
                <Controller
                  control={control}
                  name="candidateBirthday"
                  render={({ field, fieldState }) => (
                    <DatePicker
                      id="candidateBirthday"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      isInvalid={Boolean(fieldState.error)}
                      placeholder="Pilih tanggal lahir"
                    />
                  )}
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

              <ImageUpload
                id="candidatePhoto"
                label="Foto Calon"
                existingUrl={pair?.candidate.photoUrl ?? null}
                value={candidatePhoto}
                onChange={setCandidatePhoto}
                disabled={isSubmitting}
                optional
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
                <Controller
                  control={control}
                  name="viceBirthday"
                  render={({ field, fieldState }) => (
                    <DatePicker
                      id="viceBirthday"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      isInvalid={Boolean(fieldState.error)}
                      placeholder="Pilih tanggal lahir"
                    />
                  )}
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

              <ImageUpload
                id="vicePhoto"
                label="Foto Wakil"
                existingUrl={pair?.vice.photoUrl ?? null}
                value={vicePhoto}
                onChange={setVicePhoto}
                disabled={isSubmitting}
                optional
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

            <ImageUpload
              id="pairPhoto"
              label="Foto Pasangan"
              existingUrl={pair?.photoUrl ?? null}
              value={pairPhoto}
              onChange={setPairPhoto}
              disabled={isSubmitting}
              optional
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
            disabled={isSubmitting || (isCreateMode && isLoadingElections)}
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
