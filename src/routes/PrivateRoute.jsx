import { Navigate } from "react-router-dom";
import CONFIG from "../config/Index";
import Sidebar from "../components/menu/Index";

export default function PrivateRoute({ children, activeSidebar = false }) {
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);

  /**
   *  Verificar se token é valido antes de entrar, enviar para requisição de validação.
   */

  if(!token) {
      return <Navigate to="/entrar" />;
  }

  return(
    <>
      
      {activeSidebar && <Sidebar />}
      <main className="ml-56 min-h-screen">
        {activeSidebar  && children }
      </main>

      {!activeSidebar && children}
    </>
  );
}