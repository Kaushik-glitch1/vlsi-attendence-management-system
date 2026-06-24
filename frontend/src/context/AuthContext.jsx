import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, post, setAccessToken, setUnauthorizedHandler } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clear);
    (async () => {
      try {
        const { accessToken, user } = await api("/auth/refresh", { method: "POST", retry: false });
        setAccessToken(accessToken);
        setUser(user);
      } catch {
        clear();
      } finally {
        setLoading(false);
      }
    })();
  }, [clear]);

  const login = async (email, password) => {
    const data = await post("/auth/login", { email, password, deviceName: navigator.userAgent.slice(0, 60) });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await post("/auth/logout").catch(() => {});
    clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
