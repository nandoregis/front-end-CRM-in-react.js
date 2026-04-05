import { Navigate } from "react-router-dom";
import CONFIG from "../config/Index";

export default function PublicRouteLogin({ children }) {
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);

  // se estiver logado → manda pro dashboard

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}