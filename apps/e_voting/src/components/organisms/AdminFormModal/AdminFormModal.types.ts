import type { AdminUserDetail } from "@/services/user.service";

type AdminFormMode = "create" | "edit";

interface AdminFormModalProps {
  mode: AdminFormMode;
  admin: AdminUserDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export type { AdminFormModalProps, AdminFormMode };
