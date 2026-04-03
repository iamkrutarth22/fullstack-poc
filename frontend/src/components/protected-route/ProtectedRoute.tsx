import { useSelector } from "react-redux";
import type { IAuthentication } from "@/models/IStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = useSelector(
    (state: { authLogin: IAuthentication }) => state.authLogin.accessToken
  );

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;