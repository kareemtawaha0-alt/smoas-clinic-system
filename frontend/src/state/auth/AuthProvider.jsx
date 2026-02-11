import React, { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("smoas_token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("smoas_user") || "null"); } catch { return null; }
  });

  const isAuthed = Boolean(token && user);

  useEffect(() => {
    if (!token) return;
    // Optionally call /me endpoint (not included) to refresh user; kept minimal.
  }, [token]);

  const value = useMemo(() => ({
    token, user, isAuthed,
    async login(email, password) {
      const res = await authService.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("smoas_token", res.token);
      localStorage.setItem("smoas_user", JSON.stringify(res.user));
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("smoas_token");
      localStorage.removeItem("smoas_user");
    }
  }), [token, user, isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
