import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import authToken from '../utils/authToken';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const navigate = useNavigate();

  // Verifica se há um token válido no cookie
  const isAuthenticated = () => {
    return !!authToken();
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) return;

      // Se houver token, mantém o usuário autenticado e evita re-login manual
      const token = authToken();
      if (token) {
        setFuncionario({ token }); // Simplesmente mantém o usuário logado
      }
    };

    checkAuth();
  }, []);

  const postLogin = async (data) => {
    try {
      const response = await login(data);

      if (response.status !== 200) {
        setMessage({ type: 'alert-danger', text: response.message });
        return response;
      }

      setMessage({ type: 'alert-primary', text: response.message });

      if (response.data && response.data.funcionario) {
        setFuncionario(response.data.funcionario);
      } else {
        setFuncionario(null);
        return response;
      }

      // Define o cookie do token
      document.cookie = `jwt=${response.token}; path=/;`;

      navigate('/agenda');
      return response;
    } catch (error) {
      setMessage({ type: 'alert-danger', text: 'Erro ao fazer login' });
      return { status: 500, message: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
