import { useState, useEffect } from "react";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import LoadingState from "@/components/molecules/LoadingState";
import EmptyState from "@/components/molecules/EmptyState";
import Modal from "@/components/molecules/Modal";
import { getAllAdminsApi, type AdminUser } from "@/services/user.service";
import {
  getElectionAdminsApi,
  assignAdminsApi,
  removeAdminApi,
  type ElectionAdmin,
} from "@/services/election.service";
import type { AdminAssignmentModalProps } from "./AdminAssignmentModal.types";

const AdminAssignmentModal = ({
  electionId,
  electionTitle,
  isOpen,
  onClose,
}: AdminAssignmentModalProps) => {
  const [allAdmins, setAllAdmins] = useState<AdminUser[]>([]);
  const [assignedAdminIds, setAssignedAdminIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadAdmins = async () => {
      setIsLoadingAdmins(true);
      try {
        const [admins, assigned] = await Promise.all([
          getAllAdminsApi(),
          getElectionAdminsApi(electionId),
        ]);

        if (isMounted) {
          setAllAdmins(admins);
          const assignedSet = new Set(
            assigned.map((a: ElectionAdmin) => a.userId),
          );
          setAssignedAdminIds(assignedSet);
          setSelectedIds(new Set(assignedSet));
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat daftar admin.";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsLoadingAdmins(false);
      }
    };

    void loadAdmins();
    return () => {
      isMounted = false;
    };
  }, [isOpen, electionId]);

  const filteredAdmins = allAdmins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggle = (adminId: number, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(adminId);
    } else {
      next.delete(adminId);
    }
    setSelectedIds(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toAssign = Array.from(selectedIds).filter(
        (id) => !assignedAdminIds.has(id),
      );
      const toRemove = Array.from(assignedAdminIds).filter(
        (id) => !selectedIds.has(id),
      );

      if (toAssign.length > 0) {
        await assignAdminsApi({ electionId, adminIds: toAssign });
      }

      for (const adminId of toRemove) {
        await removeAdminApi(electionId, adminId);
      }

      toast.success("Penugasan admin berhasil diperbarui.");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui penugasan admin.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Penugasan Admin"
      closeButtonDisabled={isSaving}
      closeOnBackdropClick={!isSaving}
      closeOnEscape={!isSaving}
    >
      {/* Modal Body (Scrollable) */}
      <div className="p-6 overflow-y-auto flex-1 space-y-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-card-foreground">
            {electionTitle}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pilih admin yang dapat mengelola pemilihan ini. Admin yang
            tercentang akan diberikan akses.
          </p>
        </div>

        <Input
          type="search"
          placeholder="Cari admin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftElement={<Search className="w-4 h-4" />}
        />

        {isLoadingAdmins ? (
          <LoadingState message="Memuat daftar admin..." textSize="md" />
        ) : (
          <div className="space-y-2">
            {filteredAdmins.length === 0 ? (
              <EmptyState
                title="Tidak Ada Admin"
                description="Tidak ada admin yang cocok dengan pencarian Anda."
                icon={<Search className="w-8 h-8" />}
              />
            ) : (
              filteredAdmins.map((admin) => {
                const isAssigned = assignedAdminIds.has(admin.id);
                const isSelected = selectedIds.has(admin.id);
                return (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`admin-${admin.id}`}
                        checked={isSelected}
                        onChange={(e) =>
                          handleToggle(admin.id, e.target.checked)
                        }
                        disabled={isSaving}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-foreground">
                          {admin.name || admin.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{admin.username}
                        </p>
                      </div>
                    </div>
                    {isAssigned && (
                      <Badge variant="default" className="text-xs">
                        Ditugaskan
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSaving}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          icon={<Save className="w-4 h-4" />}
          disabled={isLoadingAdmins}
        >
          Simpan
        </Button>
      </div>
    </Modal>
  );
};

export default AdminAssignmentModal;
