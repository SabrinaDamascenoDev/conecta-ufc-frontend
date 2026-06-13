
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/Login/LoginPage";
import RegisterPage from "@/pages/auth/Register/RegisterPage";
import { PrivateRoute } from "./PrivateRoute";
import { Vagas } from "@/pages/vagas/VagasPage";
import { Salvos } from "@/pages/salvos/Salvos";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route  path="vagas" element={<Vagas />}></Route>
          <Route path='salvos' element={<Salvos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}