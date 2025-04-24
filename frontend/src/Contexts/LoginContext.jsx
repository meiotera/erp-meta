import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import authToken from '../utils/authToken';
import { jwtDecode } from 'jwt-decode';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!authToken();
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) return;

      const token = authToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setFuncionario(decoded);
        } catch (error) {
          console.error('Erro ao decodificar o token JWT:', error);
          setFuncionario(null);
        }
      }
    };

    checkAuth();
  }, []);

  const postLogin = async (data) => {
    try {
      setLoading(true);
      const dataResponse = await login(data);

      if (dataResponse.status !== 'success') {
        setMessage({ type: 'error', text: dataResponse.message });
        return dataResponse;
      }

      setMessage({ type: 'success', text: dataResponse.message });

      if (dataResponse && dataResponse.data) {
        setFuncionario(dataResponse.data);
      } else {
        setFuncionario(null);
        return dataResponse;
      }

      document.cookie = `jwt=${dataResponse.token}; path=/;`;

      setLoading(false);
      navigate('/agenda');
      return dataResponse;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else if (error.message) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'error',
          text: 'Ocorreu um erro inesperado.',
        });
      }

      setLoading(false);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setFuncionario(null);

    // regarregar página
    window.location.reload();
    navigate('/');
  };

  return (
    <LoginContext.Provider
      value={{
        postLogin,
        message,
        isAuthenticated,
        logout,
        funcionario,
        loading,
        setLoading,
        setMessage,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
