// re4act
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//css
import "./index.css";
// pages
import Login from "./pages/Login/Login.jsx";
import UserStats from './pages/UserStats/UserStats';
import NotFound from "./pages/NotFound/NotFound.jsx";
import Calendary from './pages/Calendary/Calendary.jsx';
import UserScreen from "./pages/UserScreen/UserScreen.jsx";
import RegisterHours from "./pages/RegisterHours/RegisterHours.jsx"
// router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Auth
import { AuthProvider } from './context/TokenContext';
import PrivateRoute from "./context/privateRoutex.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/userscreen",
    element: (
      <PrivateRoute>
        <UserScreen />
      </PrivateRoute>
    ),
  },
  {
    path: "/registerhours",
    element: (
      <PrivateRoute>
        <RegisterHours />
      </PrivateRoute>
    ),
  },
  {
    path: "/UserStats",
    element: (
      <PrivateRoute>
        <UserStats />
      </PrivateRoute>
    ),
  },
  {
    path: "/calendary",
    element: (
      <PrivateRoute>
        <Calendary />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);