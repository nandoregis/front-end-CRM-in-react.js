import { Navigate } from "react-router-dom";
import CONFIG from "../config/Index";
import Sidebar from "../components/menu/Index";
import axios from "axios";
import { useEffect } from "react";

export default function PrivateRoute({ children, activeSidebar = false }) {
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
  const expiredToken = localStorage.getItem('expired_token');

  /**
   *  Verificar se token é valido antes de entrar, enviar para requisição de validação.
   */

  if(token) {
    
    if(!expiredToken) 
    {
      axios.put(`${CONFIG.API.BASE_URL}/v1/auth/me/${token}`)
      .then( data => {
          const userdata = data.data.data;
          const date = new Date(userdata.expired_date * 1000);
          localStorage.setItem('expired_token', date.toLocaleString());
      }).catch(err => {
          logout();
      })
    }

    if(expiredToken) {
      // token expirado...
      if( ( new Date() ).toLocaleString() > expiredToken ) { 
        localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
        localStorage.removeItem('expired_token');
      }
    }

  }

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