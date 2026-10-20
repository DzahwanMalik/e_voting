import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import VoterDashboardLayout from "@/components/layouts/VoterDashboardLayout";
import VoterDashboard from "@/components/organisms/VoterDashboard";
import { useUserStore } from "@/stores/useUserStore";
import { logoutApi } from "@/services/auth.service";

const VoterDashboardPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useUserStore((state) => state.user);

  const displayName = user?.name || user?.username || "voter";

  const handleLogout = async (
    successMessage = "Berhasil keluar dari sistem.",
  ): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
      toast.success(successMessage);
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal melakukan logout.";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSingleElectionVoted = () => {
    void handleLogout(
      "Suara berhasil dicatat. Anda telah keluar otomatis dari sistem.",
    );
  };

  return (
    <VoterDashboardLayout
      displayName={displayName}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      <VoterDashboard
        displayName={displayName}
        onSingleElectionVoted={handleSingleElectionVoted}
      />
    </VoterDashboardLayout>
  );
};

export default VoterDashboardPage;

