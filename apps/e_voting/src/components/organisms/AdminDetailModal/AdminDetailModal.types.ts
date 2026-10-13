import type { AdminUserDetail } from "@/services/user.service";

interface AdminDetailModalProps {
  admin: AdminUserDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export type { AdminDetailModalProps };
