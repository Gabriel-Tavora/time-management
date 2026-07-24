import { createContext, useContext, useEffect, useState } from "react";
const TokenContext = createContext();

const ROLE_TO_EMPLOYEE = {
  6: "userscreen",
  7: "Teamleader",
  8: "Coordinator",
  9: "Coordinator",
};

export function storeLoginData({ children }) {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [role_id, setRole_id] = useState(null);
  const [employeeType, setEmployeeType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem()
    const savedId = localStorage.getItem()
    const savedRole_id = localStorage.getItem()
    const savedEmployeeType = localStorage.getItem()




    setLoading(false)
  },[]);



  const Login = (token, id, role_id) {
    const emplo
  }
}




