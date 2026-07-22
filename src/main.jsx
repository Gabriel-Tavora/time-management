// re4act
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//css
import "./index.css";
// pages
import Login from "./pages/Auth/Login/Login.jsx";
import UserStats from "./pages/common/UserStats/UserStats";
import NotFound from "./pages/common/NotFound/NotFound.jsx";
import Coordinator from "./pages/coordinator/coordinator.jsx";
import Teamleader from "./pages/teamleader/Teamleader.jsx";
import Calendary from "./pages/common/Calendary/Calendary.jsx";
import UserScreen from "./pages/user/UserScreen.jsx";
import RegisterHours from "./pages/common/RegisterHours/RegisterHours.jsx";
// router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Auth
import { AuthProvider } from "./context/TokenContext";
import PrivateRoute from "./context/privateRoutex.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Coordinator />,
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
  {
    path: "/Teamleader",
    element: (
      <PrivateRoute>
        <Teamleader />
      </PrivateRoute>
    ),
  },
  {
    path: "/Coordinator",
    element: (
      <PrivateRoute>
        <Coordinator />
      </PrivateRoute>
    ),
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
