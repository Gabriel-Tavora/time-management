// re4act
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//css
import "./index.css";
// pages
import Login from "./pages/Login/Login.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx"
import Calendary from './pages/Calendary/Calendary.jsx';
import UserScreen from "./pages/UserScreen/UserScreen.jsx";
import HistoryHours from "./pages/HistoryHours/HistoryHours.jsx"
import RegisterHours from "./pages/RegisterHours/RegisterHours.jsx"
// router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//Auth
import { AuthProvider } from './context/TokenContext';
import PrivateRoute from "./context/privateRoutex.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element:  <UserScreen />,
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
    path: "/historyHours",
    element: (
      <PrivateRoute>
        <HistoryHours />
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