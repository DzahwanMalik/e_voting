import { Calendar, Clock, Shield } from "lucide-react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import { formatDate } from "@/lib/utils";
import type { AdminDetailModalProps } from "./AdminDetailModal.types";

const AdminDetailModal = ({
  admin,
  isOpen,
  onClose,
}: AdminDetailModalProps) => {
  if (!admin) return null;

  const displayName = admin.name || admin.username;
  const roleLabel = admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" title="Detail Admin">
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Admin Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="font-sans font-bold text-2xl text-card-foreground">
                {displayName}
              </h2>
              <p className="text-sm text-muted-foreground">@{admin.username}</p>
            </div>
          </div>
        </div>

        {/* Admin Details */}
        <div className="space-y-3">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Informasi Akun
          </h3>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-foreground">
                  {roleLabel}
                </p>
                <p className="text-sm text-muted-foreground">Peran pengguna</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2.5">
          <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Dibuat: {formatDate(admin.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Diperbarui: {formatDate(admin.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-muted/30">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default AdminDetailModal;
