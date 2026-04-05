import { createContext, useContext, useEffect, useState } from "react";
import CONFIG from "../config/Index";
import axios from "axios";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const {addToast} = useToast();

  // 🔄 carregar token ao iniciar app
  useEffect(() => {
    const storedToken = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
    const expiredToken = localStorage.getItem('expired_token');

    // FAZER REQUISIÇÃO PARA VERIFICAR SE TOKEN É VALIDO.

    if (storedToken) {
      if(expiredToken) {
        if( new Date().toLocaleString() > expiredToken ) { 
          // token expirado...
          console.log('token expirado bora remover né')
          localStorage.removeItem('expired_token');
          logout();
        }
      }
    }
    
    setLoading(false);
  }, []);

  // 🔐 login
  const login = (newToken) => {
    if(!newToken) {
        addToast('error', "Problema com token de autenticação.");
        return;
    }

    localStorage.setItem(CONFIG.STORAGE.TOKEN_KEY, newToken);
    setToken(newToken);
    
  };

  // 🚪 logout
  const logout = () => {
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook customizado
export const useAuth = () => useContext(AuthContext);