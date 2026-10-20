import type { AdminUser } from "@/services/user.service";

interface AdminDetailModalProps {
  admin: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export type { AdminDetailModalProps };
