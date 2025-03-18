import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import authToken from '../utils/authToken';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [funcionario, setFuncionario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = authToken();

      if (token) {
        setIsAuthenticated(true);
        // Opcional: você pode buscar os dados do usuário usando o token
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const postLogin = async (data) => {
    try {
      const response = await login(data);

      if (response.status !== 200) {
        setMessage({ type: 'alert-danger', text: response.message });
      } else {
        setMessage({ type: 'alert-primary', text: response.message });
        setIsAuthenticated(true);

        // Garante que funcionario está sendo salvo corretamente
        if (response.data && response.data.funcionario) {
          setFuncionario(response.data.funcionario);
        } else {
          // console.error(
          //   'Erro: Dados do funcionário não foram retornados corretamente.',
          // );

          setIsAuthenticated(false);
          setFuncionario(null);
          return response;
        }

        document.cookie = `jwt=${response.token}; path=/;`;

        navigate('/agenda');
      }

      return response;
    } catch (error) {
      setMessage({ type: 'alert-danger', text: 'Erro ao fazer login' });
      return { status: 500, message: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsAuthenticated(false);
    setFuncionario(null);
    navigate('/login');
  };

  return (
    <LoginContext.Provider
      value={{
        postLogin,
        message,
        isAuthenticated,
        logout,
        funcionario,
        setIsAuthenticated,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
