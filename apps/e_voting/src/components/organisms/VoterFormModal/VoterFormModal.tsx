import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Search, Users } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import Modal from "@/components/molecules/Modal";
import { toast } from "sonner";
import {
  createVoterApi,
  updateVoterApi,
  enrollVoterToElectionsApi,
  removeVoterFromElectionApi,
} from "@/services/voter.service";
import { getElectionsApi, type ElectionListItem } from "@/services/election.service";
import { voterFormSchema, type VoterFormData } from "./VoterFormModal.schema";
import type { VoterFormModalProps, ElectionOption } from "./VoterFormModal.types";

const VoterFormModal = ({
  mode,
  voter,
  isOpen,
  onClose,
  onSaved,
}: VoterFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingElections, setIsLoadingElections] = useState(false);
  const [allElections, setAllElections] = useState<ElectionListItem[]>([]);
  const [selectedElectionIds, setSelectedElectionIds] = useState<Set<number>>(
    new Set(),
  );
  const [originalElectionIds, setOriginalElectionIds] = useState<Set<number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const isCreateMode = mode === "create";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VoterFormData>({
    resolver: zodResolver(voterFormSchema),
    mode: "onTouched",
  });

  // Reset form when modal opens or voter changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const setup = async () => {
      if (isCreateMode) {
        if (isMounted) {
          reset({
            username: "",
            name: "",
            password: "",
            electionIds: [],
          });
          setSelectedElectionIds(new Set());
          setOriginalElectionIds(new Set());
          setSearchQuery("");
        }
      } else if (voter && isMounted) {
        reset({
          username: voter.username,
          name: voter.name ?? "",
          password: "",
          electionIds: voter.electionVoters.map((ev) => ev.electionId),
        });
        const initial = new Set(
          voter.electionVoters.map((ev) => ev.electionId),
        );
        setSelectedElectionIds(new Set(initial));
        setOriginalElectionIds(new Set(initial));
      }
    };

    void setup();
    return () => {
      isMounted = false;
    };
  }, [isOpen, voter, isCreateMode, reset]);

  // Fetch elections when modal opens (both modes)
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
        if (isMounted) setIsLoadingElections(false);
      }
    };

    void loadElections();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredElections: ElectionOption[] = allElections
    .filter(
      (election) =>
        election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (election.description ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
    .map((election) => ({
      election,
      isEnrolled: selectedElectionIds.has(election.id),
    }));

  const handleToggleElection = (electionId: number, checked: boolean) => {
    setSelectedElectionIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(electionId);
      } else {
        next.delete(electionId);
      }
      return next;
    });
  };

  // Compute election changes between original and current selections
  const computeElectionChanges = () => {
    const toAdd: number[] = [];
    const toRemove: number[] = [];

    selectedElectionIds.forEach((id) => {
      if (!originalElectionIds.has(id)) {
        toAdd.push(id);
      }
    });

    originalElectionIds.forEach((id) => {
      if (!selectedElectionIds.has(id)) {
        toRemove.push(id);
      }
    });

    return { toAdd, toRemove };
  };

  // Apply election changes in edit mode (enroll + unenroll)
  const applyElectionChanges = async (): Promise<void> => {
    const { toAdd, toRemove } = computeElectionChanges();

    // Enroll voter to newly selected elections
    if (toAdd.length > 0) {
      try {
        await enrollVoterToElectionsApi(voter!.id, toAdd);
        toast.success(
          `Voter didaftarkan ke ${toAdd.length} election.`,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mendaftarkan voter ke election.";
        toast.error(message);
      }
    }

    // Remove voter from deselected elections (one by one, BR-16 safe)
    for (const electionId of toRemove) {
      try {
        await removeVoterFromElectionApi(voter!.id, electionId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mengeluarkan voter dari election.";
        toast.error(message);
      }
    }

    if (toRemove.length > 0) {
      toast.success(
        `Voter dikeluarkan dari ${toRemove.length} election.`,
      );
    }
  };

  const onValidSubmit = async (data: VoterFormData) => {
    const trimmedUsername = data.username.trim();
    const trimmedName = data.name.trim();

    if (isCreateMode && !data.password) {
      toast.error("Password wajib diisi untuk voter baru.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        await createVoterApi({
          username: trimmedUsername,
          password: data.password!,
          name: trimmedName,
          electionIds:
            selectedElectionIds.size > 0
              ? Array.from(selectedElectionIds)
              : undefined,
        });
        toast.success("Voter berhasil dibuat.");
      } else if (voter) {
        const payload: Record<string, unknown> = {
          username: trimmedUsername,
          name: trimmedName,
        };

        if (data.password) {
          payload.password = data.password;
        }

        await updateVoterApi(voter.id, payload);
        toast.success("Voter berhasil diperbarui.");

        // Apply election enrollment changes (BR-08 enforced by backend)
        await applyElectionChanges();
      }
      onSaved();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan voter.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isCreateMode ? "Tambah Voter" : "Edit Voter";

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onValidSubmit)(e);
  };

  const electionHelpText = isCreateMode
    ? "Pilih election yang ingin didaftarkan ke pemilih. Kosongkan jika tidak ingin mendaftarkan ke election manapun."
    : "Kelola election yang diikuti pemilih. Centang untuk mendaftarkan, hapus centang untuk mengeluarkan. Voter yang sudah memberi vote dapat dikeluarkan (vote tetap berlaku).";

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
      <form onSubmit={handleFormSubmit} noValidate className="flex flex-col">
        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Voter Information */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Informasi Voter
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
                    ? "Masukkan password (minimal 6 karakter)"
                    : "Masukkan password baru (opsional)"
                }
                leftElement={<Lock className="w-4 h-4" />}
                {...register("password")}
              />
            </FormField>
          </div>

          {/* Election Selection (create and edit modes) */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isCreateMode ? "Pemilihan yang Diikuti" : "Kelola Election"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {electionHelpText}
            </p>

            <Input
              type="search"
              placeholder="Cari election..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
              disabled={isSubmitting || isLoadingElections}
            />

            {isLoadingElections ? (
              <LoadingState
                message="Memuat daftar pemilihan"
                textSize="sm"
              />
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {filteredElections.length === 0 ? (
                  <EmptyState
                    title="Tidak Ada Pemilihan"
                    description="Tidak ada election yang tersedia atau cocok dengan pencarian Anda."
                    icon={<Users className="w-8 h-8" />}
                  />
                ) : (
                  filteredElections.map(({ election, isEnrolled }) => (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`election-${election.id}`}
                          checked={isEnrolled}
                          onChange={(e) =>
                            handleToggleElection(election.id, e.target.checked)
                          }
                          disabled={isSubmitting}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-medium text-foreground">
                            {election.title}
                          </p>
                          {election.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {election.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isEnrolled && (
                        <Badge variant="success" className="text-xs">
                          Terdaftar
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
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
            disabled={isLoadingElections}
          >
            {isCreateMode ? "Simpan" : "Perbarui"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VoterFormModal;
