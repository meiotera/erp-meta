import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import authToken from '../utils/authToken';

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

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) return;

      // Se houver token, mantém o usuário autenticado e evita re-login manual
      const token = authToken();
      if (token) {
        // Decode the token to get user information if needed
        // For now, just set the token
        setFuncionario({ token }); // Simplesmente mantém o usuário logado
      }
    };

    checkAuth();
  }, []);

  const postLogin = async (data) => {
    try {
      setLoading(true);
      const dataResponse = await login(data); // Agora recebe o objeto JSON diretamente

      console.log(dataResponse);

      if (dataResponse.status !== 200) {
        // Verifica o status do backend
        setMessage({ type: 'alert-danger', text: dataResponse.message });
        return dataResponse;
      }

      setMessage({ type: 'alert-primary', text: dataResponse.message });

      if (dataResponse && dataResponse.data) {
        setFuncionario(dataResponse.data); // Atualize o estado com os dados do funcionário
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
        setMessage({ type: 'alert-danger', text: error.response.data.message });
      } else if (error.message) {
        // Caso seja um erro genérico do JavaScript
        setMessage({ type: 'alert-danger', text: error.message });
      } else {
        // Mensagem genérica para erros desconhecidos
        setMessage({
          type: 'alert-danger',
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
