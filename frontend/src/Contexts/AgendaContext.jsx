import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginContext } from './LoginContext';
import { minhaAgenda } from '../../api/minhaAgenda';

export const AgendaContext = createContext();

export const AgendaProvider = ({ children }) => {
  const [agenda, setAgenda] = useState({ agenda: [], agendamentos: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { funcionario } = useContext(LoginContext);

  const carregarAgenda = async () => {
    try {
      setLoading(true);
      const data = await minhaAgenda();
      setAgenda(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setMessage({ type: 'error', text: 'Erro ao buscar agendamentos' });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (funcionario) {
      carregarAgenda();
    }
  }, [funcionario]);

  return (
    <AgendaContext.Provider
      value={{
        agenda,
        setAgenda,
        loading,
        message,
        setMessage,
        carregarAgenda,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};
