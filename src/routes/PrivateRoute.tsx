import { Navigate, Outlet } from "react-router-dom";
import { loginService } from "..//services/loginServise";

export function PrivateRoute() {
  const token = loginService.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}