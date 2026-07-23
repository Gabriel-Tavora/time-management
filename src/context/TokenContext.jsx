import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

const ROLE_TO_EMPLOYEE = {
  6: "userscreen",
  7: "Teamleader",
  8: "Coordinator",
  9: "Coordinator",
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedId = localStorage.getItem("userId");
    const savedRoleId = localStorage.getItem("role_id");
    const savedEmployee = localStorage.getItem("employee");

    if (savedToken) setToken(savedToken);
    if (savedId) setId(Number(savedId));
    if (savedRoleId) setRoleId(Number(savedRoleId));
    if (savedEmployee) setEmployee(savedEmployee);

    setLoading(false);
  }, []);

  const login = (id, token, role_id) => {
    const employeePage = ROLE_TO_EMPLOYEE[role_id] ?? null;

    setId(id);
    setToken(token);
    setRoleId(role_id);
    setEmployee(employeePage);

    localStorage.setItem("userId", id);
    localStorage.setItem("token", token);
    localStorage.setItem("role_id", role_id);

    if (employeePage) {
      localStorage.setItem("employee", employeePage);
    } else {
      console.warn(`role_id desconhecido: ${role_id}`);
      localStorage.removeItem("employee");
    }

    return employeePage;
  };

  const logout = () => {
    setId(null);
    setToken(null);
    setRoleId(null);
    setEmployee(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("employee");
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        token,
        roleId,
        employee,
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