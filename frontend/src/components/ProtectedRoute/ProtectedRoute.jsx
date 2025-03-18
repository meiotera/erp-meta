import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../../Contexts/LoginContext';

import authToken from '../../utils/authToken';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(LoginContext);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authToken();

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [setIsAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
