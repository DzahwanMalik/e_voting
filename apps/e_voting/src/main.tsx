import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { PublicRoute } from "@/components/layouts/PublicRoute";
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute";
import { LoginPage } from "@/components/pages/LoginPage";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { NotFoundPage } from "@/components/pages/NotFoundPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        {/* Rute Tamu (Public / Guest Only) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rute Khusus Admin & Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Rute Khusus Voter */}
        <Route element={<ProtectedRoute allowedRoles={["VOTER"]} />}>
          <Route path="/voter/dashboard" element={<DashboardPage />} />
        </Route>

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

