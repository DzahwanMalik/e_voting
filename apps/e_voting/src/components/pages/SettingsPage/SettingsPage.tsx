import { useState } from "react";
import { AlertTriangle, Settings, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import SectionCard from "@/components/molecules/SectionCard";
import ResetVotingModal from "@/components/organisms/ResetVotingModal";
import { resetAllVotesApi } from "@/services/vote.service";

const SettingsPage = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetVoting = async () => {
    setIsResetting(true);
    try {
      const response = await resetAllVotesApi();
      toast.success(
        `${response.message} ${response.data.deletedVotes} suara dihapus dan ${response.data.resetVoters} status pemilih di-reset.`,
      );
      setIsResetModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mereset data voting.";
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isResetting) {
      setIsResetModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground">
              Pengaturan Sistem
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola operasi administratif yang hanya tersedia untuk Super
              Admin.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={
          <span className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" />
            Zona Berbahaya
          </span>
        }
        subtitle="Operasi di area ini bersifat permanen dan memengaruhi seluruh election."
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-foreground">
                  Reset Data Voting
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Menghapus seluruh vote pada semua election dan mengembalikan
                  status seluruh pemilih menjadi belum memilih. Data election,
                  paslon, pemilih, dan penugasan admin tidak berubah.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setIsResetModalOpen(true)}
              icon={<AlertTriangle className="w-4 h-4" />}
            >
              Reset Semua Data Voting
            </Button>
          </div>
        </div>
      </SectionCard>

      {isResetModalOpen && (
        <ResetVotingModal
          isOpen={isResetModalOpen}
          isSubmitting={isResetting}
          onClose={handleCloseModal}
          onConfirm={handleResetVoting}
        />
      )}
    </div>
  );
};

export default SettingsPage;
