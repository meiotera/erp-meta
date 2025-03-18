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

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const data = await listarFuncionarios();

        setFuncionarios(data);

        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    };

    fetchFuncionarios();
  }, []);

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
      setMessage('Erro ao buscar agenda');
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
        funcionarioId,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
