import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import PublicRoute from "@/components/layouts/PublicRoute";
import ProtectedRoute from "@/components/layouts/ProtectedRoute";
import LoginPage from "@/components/pages/LoginPage";
import VoterDashboardPage from "@/components/pages/VoterDashboardPage";
import AdminShellPage from "@/components/pages/AdminShellPage";
import ElectionPage from "@/components/pages/ElectionPage";
import VoterPage from "@/components/pages/VoterPage";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import NotFoundPage from "@/components/pages/NotFoundPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="bottom-right" richColors />
    <BrowserRouter>
      <Routes>
        {/* Rute Tamu (Public / Guest Only) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rute Admin & Super Admin dengan Sidebar Layout */}
        <Route
          element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}
        >
          <Route element={<AdminShellPage />}>
            <Route path="/admin/elections" element={<ElectionPage />} />
            <Route
              path="/admin/candidate-pairs"
              element={<ComingSoonPage title="Manajemen Paslon Kandidat" />}
            />
            <Route
              path="/admin/voters"
              element={<VoterPage />}
            />
          </Route>
        </Route>

        {/* Rute Khusus Voter */}
        <Route element={<ProtectedRoute allowedRoles={["VOTER"]} />}>
          <Route path="/voter/dashboard" element={<VoterDashboardPage />} />
        </Route>

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

