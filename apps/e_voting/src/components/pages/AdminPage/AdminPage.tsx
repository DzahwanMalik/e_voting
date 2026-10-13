import { useState, useEffect } from "react";
import { Shield, Calendar, Edit, Trash2, Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import LoadingState from "@/components/molecules/LoadingState";
import SectionCard from "@/components/molecules/SectionCard";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import AdminFormModal from "@/components/organisms/AdminFormModal";
import AdminDetailModal from "@/components/organisms/AdminDetailModal";
import {
  getAllAdminsApi,
  getAdminByIdApi,
  deleteAdminApi,
  type AdminUser,
  type AdminUserDetail,
} from "@/services/user.service";
import { formatDate } from "@/lib/utils";

const AdminPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] =
    useState<AdminUser | null>(null);

  const [detailAdmin, setDetailAdmin] = useState<AdminUserDetail | null>(null);
  const [detailAdminId, setDetailAdminId] = useState<number | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editAdmin, setEditAdmin] = useState<AdminUserDetail | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        const data = await getAllAdminsApi();
        if (isMounted) {
          setAdmins(data);
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAdmins();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Fetch admin detail for view modal
  useEffect(() => {
    if (!detailAdminId) return;

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const data = await getAdminByIdApi(detailAdminId);
        if (isMounted) {
          setDetailAdmin(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Gagal memuat detail admin.";
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setDetailAdminId(null);
        }
      }
    };

    void fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [detailAdminId]);

  // Fetch admin detail for edit form
  const handleEdit = async (admin: AdminUser) => {
    try {
      const data = await getAdminByIdApi(admin.id);
      setFormMode("edit");
      setEditAdmin(data);
      setIsFormOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal memuat detail admin.";
      toast.error(message);
    }
  };

  const handleCreate = () => {
    setFormMode("create");
    setEditAdmin(null);
    setIsFormOpen(true);
  };

  const handleViewDetail = (adminId: number) => {
    setDetailAdmin(null);
    setDetailAdminId(adminId);
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    setIsDeletingId(admin.id);
    try {
      await deleteAdminApi(admin.id);
      toast.success(
        `Admin "${admin.name || admin.username}" berhasil dihapus.`,
      );
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus admin.";
      toast.error(message);
    } finally {
      setIsDeletingId(null);
      setDeleteConfirmAdmin(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmAdmin) {
      void handleDeleteAdmin(deleteConfirmAdmin);
    }
  };

  const handleFormSaved = () => {
    setIsFormOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const columns = [
    {
      key: "name",
      header: "Nama",
      cell: (row: AdminUser) => {
        const displayName = row.name || row.username;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <span className="font-sans font-semibold text-foreground">
                {displayName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "username",
      header: "Username",
      cell: (row: AdminUser) => (
        <span className="text-muted-foreground">@{row.username}</span>
      ),
    },
    {
      key: "role",
      header: "Peran",
      cell: (row: AdminUser) => (
        <Badge variant="secondary" className="px-2.5 py-0.5">
          {row.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      cell: (row: AdminUser) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(row.createdAt)}</span>
        </div>
      ),
    },
  ];

  const rowOptions = [
    {
      label: "Lihat Detail",
      icon: <Layers className="w-4 h-4" />,
      onClick: (row: AdminUser) => handleViewDetail(row.id),
    },
    {
      label: "Edit Admin",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: AdminUser) => {
        void handleEdit(row);
      },
    },
    {
      label: "Hapus Admin",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: AdminUser) => setDeleteConfirmAdmin(row),
      isDestructive: true,
      disabled: (row: AdminUser) => isDeletingId === row.id,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <SectionCard padding="default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
                Manajemen Admin
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Kelola seluruh admin dalam sistem.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Admin Table Section */}
        <SectionCard title={`Daftar Admin (${admins.length})`} padding="none">
          <div className="p-6 sm:p-8">
            <div className="flex justify-end items-center mb-4">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleCreate}
              >
                Tambah Admin
              </Button>
            </div>
            {isLoading ? (
              <LoadingState message="Memuat daftar admin..." textSize="lg" />
            ) : (
              <DataTable<AdminUser>
                data={admins}
                columns={columns}
                rowOptions={rowOptions}
                isLoading={isLoading}
                emptyTitle="Belum Ada Admin"
                emptyDescription="Belum ada admin yang terdaftar dalam sistem."
              />
            )}
          </div>
        </SectionCard>
      </div>

      {/* Admin Detail Modal */}
      <AdminDetailModal
        admin={detailAdmin}
        isOpen={detailAdmin !== null}
        onClose={() => setDetailAdmin(null)}
      />

      {/* Admin Form Modal (Create / Edit) */}
      <AdminFormModal
        mode={formMode}
        admin={editAdmin}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleFormSaved}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmAdmin !== null}
        message={
          deleteConfirmAdmin
            ? `Apakah Anda yakin ingin menghapus admin "${deleteConfirmAdmin.name || deleteConfirmAdmin.username}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        isDestructive
        isSubmitting={isDeletingId !== null}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmAdmin(null)}
      />
    </>
  );
};

export default AdminPage;
