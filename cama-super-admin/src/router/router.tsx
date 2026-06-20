import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/app/App";
import Layout, { loader as mainLoader } from "@/layout/Layout";
import Login from "@/app/login/Page";
import React from "react";

import { ProtectedRoute } from "./ProtectedRoute";
import AdminRouteFallback from "./AdminRouteFallback";

import Webview from "@/layout/Webview";
import { webviewRouters } from "./webview";

// Route Module Type
type RouteModule = { default: React.ComponentType<any>; loader?: () => any };

// _로 시작하면 무시함
const ROUTES = import.meta.glob("/src/app/main/**/!(_)/Page.tsx", {
  eager: true,
});

//  파일불러옴.. Page.tsx 만 가져옴
const routes = Object.keys(ROUTES).map((route) => {
  const path = route
    .replace(/\/src\/app|Page|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .replace(/\/$/, "")
    .replace(/^\/main\//, "");

  const modules = ROUTES[route] as RouteModule;

  const Element = React.createElement(modules.default);
  return {
    path,
    element: <ProtectedRoute>{Element}</ProtectedRoute>,
    ...(modules.loader ? { loader: modules.loader } : {}),
  };
});

/** /login 은 basename 없이, /admin/* 은 기존 basename 유지 */
export function resolveBasename(): string {
  if (typeof window === "undefined") {
    return "/admin";
  }
  const path = window.location.pathname;
  return path === "/login" || path.startsWith("/login?") ? "/" : "/admin";
}

//  Create Routers
export const router = createBrowserRouter(
  [
  {
    path: "/",
    element: <App />,
    errorElement: <AdminRouteFallback />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/webview",
        element: <Webview />,
        children: webviewRouters,
      },
      {
        path: "/main",
        element: <Layout />,
        loader: mainLoader,
        children: routes,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
  ],
  { basename: resolveBasename() },
);
