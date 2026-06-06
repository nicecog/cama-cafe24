import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { router } from "@/router/router";
import "./global.css";
import RQProvider from "./utils/RQProvider";
// i18n 설정 (앱 초기화 전에 로드)
import "./i18n";
// Datepicker 관련 CSS
import "react-datepicker/dist/react-datepicker.css";
// import RQProvider from "./utils/RQProvider";
// Grid 관련 CSS
import "@/assets/ag-grid-theme-builder.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RQProvider>
      <Provider store={store}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <RouterProvider router={router} />
        </CookiesProvider>
      </Provider>
    </RQProvider>
  </React.StrictMode>
);
