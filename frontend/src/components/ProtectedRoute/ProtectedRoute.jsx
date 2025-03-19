import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../../Contexts/LoginContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(LoginContext);

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
