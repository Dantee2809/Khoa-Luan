import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return authUser ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
