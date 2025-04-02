import React, { createContext, useEffect, useState } from 'react';
import {
  listarFuncionarios,
  listarDataseHorarios,
} from '../../api/funcionario';
import { agendarAtendimento } from '../../api/agendamento';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [funcionarioId, setFuncionarioId] = useState(null);
  const [message, setMessage] = useState(null);
  const [isFetched, setIsFetched] = useState(false); // Controle de requisições

  useEffect(() => {
    const fetchFuncionarios = async () => {
      if (isFetched) return; // Evita múltiplas requisições
      try {
        const data = await listarFuncionarios();
        setFuncionarios(data);
        setIsFetched(true); // Marca como carregado
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        setMessage({ type: 'error', text: 'Erro ao buscar funcionários' });
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, [isFetched]);

  const fetchAgenda = async (id) => {
    try {
      setLoading(true);
      const data = await listarDataseHorarios(id);
      if (data.status === 'error') {
        setMessage({ type: 'error', text: data.message });
        setAgenda([]);
        setLoading(false);
        return;
      } else {
        setAgenda(data.agenda);
        setFuncionarioId(id);
        setMessage(null);
      }

      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao buscar agenda' });
      setLoading(false);
    }
  };

  const postAgendamento = async (data) => {
    try {
      const response = await agendarAtendimento(data);
      if (response.status === 200) {
        setMessage({ type: 'success', text: response.message });
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao agendar atendimento' });
    }
  };

  return (
    <UsersContext.Provider
      value={{
        funcionarios,
        setFuncionarios,
        loading,
        setLoading,
        agenda,
        setAgenda,
        fetchAgenda,
        postAgendamento,
        message,
        setMessage,
        funcionarioId,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
