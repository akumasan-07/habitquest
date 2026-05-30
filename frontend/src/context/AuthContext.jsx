import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, saveToken } from "@/lib/auth";
import { setAuthToken } from "@/lib/api";
import { getCurrentUser } from "@/lib/authApi";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if(!token) {
        setLoading(false);
        return;
      }

      try{
        setAuthToken(token);
        
        const userData = await getCurrentUser();
        setUser(userData);
      }catch(error){
        console.error(error);

        removeToken();
        setAuthToken(null);
        setUser(null);
      }finally{
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    saveToken(token);
    setAuthToken(token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading, login, logout, isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =  useContext(AuthContext);

  if(!context){
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};