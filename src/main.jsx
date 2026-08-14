// React
import {  Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// CSS
import "./styles/index.css";
import "../src/styles/global.css";

// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth
import { AuthProvider } from "./context/TokenContext";
import PrivateRoute from "./context/privateRoutex.jsx";

// Tema
import { ThemeProvider } from "./context/themeContext.jsx";

// Lazy Pages
const Login = lazy(() => import("./pages/Auth/Login/Login.jsx"));
const ForgotPassword = lazy(() =>
  import("./pages/Auth/ForgotPassword/ForgotPassword.jsx")
);
const UserScreen = lazy(() => import("./pages/user/UserScreen.jsx"));
const RegisterHours = lazy(() =>
  import("./pages/common/RegisterHours/RegisterHours.jsx")
);
const UserStats = lazy(() =>
  import("./pages/common/UserStats/UserStats.jsx")
);
const Calendary = lazy(() =>
  import("./pages/common/Calendary/Calendary.jsx")
);
const Teamleader = lazy(() =>
  import("./pages/teamleader/Teamleader.jsx")
);
const Coordinator = lazy(() =>
  import("./pages/coordinator/Coordinator.jsx")
);
const Menager = lazy(() =>
  import("./pages/Menager/Menager.jsx")
);
const SuperAdmin = lazy(() =>
  import("./pages/superAdmin/SuperAdmin.jsx")
);
const NotFound = lazy(() =>
  import("./pages/common/NotFound/NotFound.jsx")
);

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/ForgotPassword", element: <ForgotPassword /> },
  { path: "/userscreen", element: <UserScreen /> },
  { path: "/registerhours", element: <RegisterHours /> },
  { path: "/UserStats", element: <UserStats /> },
  { path: "/calendary", element: <Calendary /> },
  { path: "/Teamleader", element: <Teamleader /> },
  { path: "/Coordinator", element: <Coordinator /> },
  { path: "/Menager", element: <Menager /> },
  { path: "/SuperAdmin", element: <SuperAdmin /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider> {/* <-- envolve tudo */}
          <Suspense fallback={<div>Carregando...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
);