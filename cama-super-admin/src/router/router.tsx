import { createBrowserRouter } from "react-router-dom";
import App from "@/app/App";
import Layout, { loader as mainLoader } from "@/layout/Layout";
import Login from "@/app/login/Page";
import React from "react";

import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "@/app/NotFound";

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
    .replace(/\/$/, "");

  const modules = ROUTES[route] as RouteModule;

  const Element = React.createElement(modules.default);
  return {
    path,
    element: <ProtectedRoute>{Element}</ProtectedRoute>,
    ...(modules.loader ? { loader: modules.loader } : {}),
  };
});

//  Create Routers
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
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
    ],
  },
  // { path: "*", element: <NotFound /> },
]);
