import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import authToken from '../utils/authToken';

import { jwtDecode } from 'jwt-decode';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [funcionario, setFuncionario] = useState(null); // Initialize as null

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica se há um token válido no cookie
  const isAuthenticated = () => {
    return !!authToken();
  };

  // useEffect(() => {
  //   const checkAuth = () => {
  //     if (!isAuthenticated()) return;

  //     // Se houver token, mantém o usuário autenticado e evita re-login manual
  //     const token = authToken();
  //     if (token) {
  //       // For now, just set the token
  //       setFuncionario({ token });
  //     }
  //   };

  //   checkAuth();
  // }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) return;

      // Obtém o token do cookie
      const token = authToken();
      if (token) {
        try {
          // Decodifica o token para obter os dados do usuário
          const decoded = jwtDecode(token);
          setFuncionario(decoded); // Armazena os dados decodificados no estado

          console.log('decode', decoded);
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
      const dataResponse = await login(data); // Agora recebe o objeto JSON diretamente

      if (dataResponse.status !== 'success') {
        // Verifica o status do backend
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

      // Define o cookie do token
      document.cookie = `jwt=${dataResponse.token}; path=/;`;

      setLoading(false);
      navigate('/agenda');
      return dataResponse;
    } catch (error) {
      // Verifica se o erro tem uma mensagem do backend
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else if (error.message) {
        // Caso seja um erro genérico do JavaScript
        setMessage({ type: 'error', text: error.message });
      } else {
        // Mensagem genérica para erros desconhecidos
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
