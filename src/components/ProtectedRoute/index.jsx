import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  return (
    <div>
      {isAuthenticated === true ? (
        <>{props.children}</>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
};

export default ProtectedRoute;
