import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("user");
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;