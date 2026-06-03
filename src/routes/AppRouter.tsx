// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        {/* Quando tiver auth: */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
      </Routes>
    </BrowserRouter>
  );
}