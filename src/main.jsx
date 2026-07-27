// React
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// CSS
import "./index.css";

// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Auth
import { AuthProvider } from "./context/TokenContext";
import PrivateRoute from "./context/privateRoutex.jsx";

// Lazy Pages
const Login = lazy(() => import("./pages/Auth/Login/Login.jsx"));
const FotgotPassword = lazy(() =>
  import("./pages/Auth/FotgotPassword/FotgotPassword.jsx")
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

const SuperAdmin = lazy(() =>
  import("./pages/superAdmin/SuperAdmin.jsx")
);

const NotFound = lazy(() =>
  import("./pages/common/NotFound/NotFound.jsx")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/FotgotPassword",
    element: <FotgotPassword />,
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
    path: "/SuperAdmin",
    element: (
      <PrivateRoute>
        <SuperAdmin />
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
    <HelmetProvider>
      <AuthProvider>
        <Suspense fallback={<div>Carregando...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);