import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../store/features/authSlice";
import HomeLayout from "../layouts/home";
import ProtectedRoute from "../components/ProtectedRoute";
import Logout from "../pages/logout";

export const LoginPage = lazy(() => import("../pages/login"));
export const Page404 = lazy(() => import("../pages/page-not-found"));
export const PlayPage = lazy(() => import("../pages/play"));
export const SignupPage = lazy(() => import("../pages/signup"));
export const StatisticsPage = lazy(() => import("../pages/statistics"));
export const VerifyOtpPage = lazy(() => import("../pages/verify-otp"));

export default function Router() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const routes = useRoutes([
    {
      path: "/",
      element: !isAuthenticated ? (
        <LoginPage />
      ) : (
        <HomeLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </HomeLayout>
      ),
      children: [
        {
          element: <Navigate to="/play" replace />,
          index: true,
        },
        {
          path: "play",
          element: (
            <ProtectedRoute>
              <PlayPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "statistics",
          element: (
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },

    {
      path: "logout",
      element: <Logout />,
    },

    {
      path: "verify",
      element: <VerifyOtpPage />,
    },

    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
