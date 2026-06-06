import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const App = () => {
  const { isAuthLogin } = useAuth();

  const { pathname } = useLocation();

  if (pathname === "/") {
    return isAuthLogin() ? (
      <Navigate to={import.meta.env.VITE_DEFAULT_PAGE} />
    ) : (
      <Navigate to={"/login"} />
    );
  }

  return <Outlet />;
};
export default App;
