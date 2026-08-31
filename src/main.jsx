// React
import { Suspense, lazy } from "react";
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
const UserScreen = lazy(() => import("./pages/Users/UserScreen.jsx"));

const RegisterHours = lazy(() => import("./pages/common/RegisterHours/RegisterHours.jsx"));

const EditHours = lazy(() =>
  import("./pages/common/EditHours/EditHours.jsx")
);
const EditUserData = lazy(() =>
  import("./pages/common/EditUserData/EditUserData.jsx")
);
const UserStats = lazy(() =>
  import("./pages/common/UserStats/UserStats.jsx")
);
const Calendary = lazy(() =>
  import("./pages/common/Calendary/Calendary.jsx")
);
const Teamleader = lazy(() =>
  import("./pages/Users/Teamleader.jsx")
);
const Coordinator = lazy(() =>
  import("./pages/Users/Coordinator.jsx")
);
const Menager = lazy(() =>
  import("./pages/Users/Menager.jsx")
);
const SuperAdmin = lazy(() =>
  import("./pages/Users/SuperAdmin.jsx")
);
const PdfsMonth = lazy(() =>
  import("./pages/common/PdfsMonth/PdfsMonth.jsx")
);
const NotFound = lazy(() =>
  import("./pages/common/NotFound/NotFound.jsx")
);
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/ForgotPassword", element: <ForgotPassword /> },

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
    path: "/EditHours",
    element: (
      <PrivateRoute>
        <EditHours />
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
    path: "/EditUserData",
    element: (
      <PrivateRoute>
        <EditUserData />
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
  {
    path: "/Menager",
    element: (
      <PrivateRoute>
        <Menager />
      </PrivateRoute>
    ),
  },
  {
    path: "/SuperAdmin",
    element: (
      <PrivateRoute>
        <SuperAdmin />
      </PrivateRoute>
    ),
  },
  {
    path: "/PdfsMonth",
    element: (
      <PrivateRoute>
        <PdfsMonth />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<div>Carregando...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  </HelmetProvider>
);