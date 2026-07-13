import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedId = localStorage.getItem("userId");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedId) {
      setId(Number(savedId));
    }

    setLoading(false);
  }, []);

  const login = (id, token) => {
    setId(id);
    setToken(token);

    localStorage.setItem("userId", id);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setId(null);
    setToken(null);

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        token,
        authenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthValue = () => useContext(AuthContext);