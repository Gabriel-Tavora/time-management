import { Navigate } from "react-router-dom";
import { useAuthValue } from "../context/TokenContext";

const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useAuthValue();

  if (loading) {
    return <p>Carregando...</p>;
  }

  return authenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;