import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { getUserInfo } = useAuth();
  const { isLogin } = getUserInfo();

  if (isLogin) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};
