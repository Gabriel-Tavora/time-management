// re4act
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//css
import "./index.css";
// pages
import App from "./App.jsx";
import Login from "./pages/Login/Login.jsx";
import UserScreen from "./pages/UserScreen/UserScreen.jsx";
import RegisterHours from "./components/RegisterHours/RegisterHours.jsx"
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
    path:"/registerhours",
    element: <RegisterHours />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
