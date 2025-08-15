import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USER_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  }, [user]);

  const signup = (payload) => {
    // payload: { firstName, lastName, email, password, phone, address, city, postalCode }
    const next = { ...payload, id: self.crypto?.randomUUID?.() || String(Date.now()) };
    setUser(next);
  };

  const signin = ({ email, password }) => {
    try {
      const saved = JSON.parse(localStorage.getItem(USER_KEY));
      if (saved && saved.email === email && saved.password === password) {
        setUser(saved);
        return { ok: true };
      }
    } catch {}
    return { ok: false, error: "E‑posta veya şifre hatalı." };
  };

  const signout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);