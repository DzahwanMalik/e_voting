import { useState } from "react";
import { FileSpreadsheet, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import Modal from "@/components/molecules/Modal";
import FileUpload from "@/components/molecules/FileUpload";
import Button from "@/components/atoms/Button";
import { toast } from "sonner";
import { importVotersFromExcelApi } from "@/services/voter.service";
import type { ImportVotersModalProps } from "./ImportVotersModal.types";

const VOTER_TEMPLATE_DATA = [
  { username: "voter001", name: "Nama Voter 1", password: "password123" },
  { username: "voter002", name: "Nama Voter 2", password: "password456" },
];

const ImportVotersModal = ({
  electionId,
  electionTitle,
  isOpen,
  onClose,
  onImportSuccess,
}: ImportVotersModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(VOTER_TEMPLATE_DATA);
    XLSX.utils.book_append_sheet(wb, ws, "Voters");
    XLSX.writeFile(wb, "template_voter.xlsx");
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Silakan pilih file Excel terlebih dahulu.");
      return;
    }

    setIsImporting(true);

    try {
      const response = await importVotersFromExcelApi(
        electionId,
        selectedFile,
      );

      toast.success(response.message, {
        description: `${response.importStats.createdCount} baru dibuat, ${response.importStats.updatedCount} diperbarui.`,
      });

      onImportSuccess?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengimpor voter.";
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Impor Voter dari Excel"
      showCloseButton={!isImporting}
      closeOnEscape={!isImporting}
      closeOnBackdropClick={!isImporting}
    >
      <div className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Impor voter dari file Excel untuk pemilihan{" "}
          <strong className="text-foreground">
            {electionTitle ?? `#${electionId}`}
          </strong>
          . File harus berisi kolom <code className="mx-0.5 px-1 py-0.5 bg-muted rounded text-xs">username</code>,{" "}
          <code className="mx-0.5 px-1 py-0.5 bg-muted rounded text-xs">name</code>, dan{" "}
          <code className="mx-0.5 px-1 py-0.5 bg-muted rounded text-xs">password</code>.
          Import ini akan mengganti semua voter yang ada pada pemilihan ini.
        </p>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
          <FileSpreadsheet className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">
            Format: .xlsx, .xls, .csv — Maksimal 5 MB
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleDownloadTemplate}
        >
          Unduh Template
        </Button>

        <FileUpload
          accept=".xlsx,.xls,.csv"
          placeholder="Klik untuk memilih file Excel"
          onChange={handleFileChange}
          disabled={isImporting}
        />

        {!selectedFile && (
          <p className="text-xs text-muted-foreground">
            Belum ada file yang dipilih.
          </p>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isImporting}
        >
          Batal
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleImport}
          disabled={isImporting || !selectedFile}
          icon={isImporting ? undefined : <Upload className="w-4 h-4" />}
          isLoading={isImporting}
        >
          {isImporting ? "Mengimpor..." : "Konfirmasi Impor"}
        </Button>
      </div>
    </Modal>
  );
};

export default ImportVotersModal;
