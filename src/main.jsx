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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/userscreen",
    element: <UserScreen />,
  },
  {
    path: "/registerhours",
    element: <RegisterHours />,
  },
  {
    path: "/historyHours",
    element: <HistoryHours />,
  },
  {
    path: "/calendary",
    element: <Calendary />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
