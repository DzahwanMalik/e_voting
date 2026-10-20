import type { AdminUser } from "@/services/user.service";

type AdminFormMode = "create" | "edit";

interface AdminFormModalProps {
  mode: AdminFormMode;
  admin: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export type { AdminFormModalProps, AdminFormMode };
