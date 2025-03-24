import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginContext } from './LoginContext';
import { minhaAgenda, realizados } from '../../api/minhaAgenda';
import {
  buscaCliente,
  buscarAtendimentosCliente,
} from '../../api/buscaCliente';

export const AgendaContext = createContext();

export const AgendaProvider = ({ children }) => {
  const [agenda, setAgenda] = useState({ agenda: [], agendamentos: [] });
  const [atendimentos, setAtendimentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [cliente, setCliente] = useState(null);
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
      setMessage({ type: 'error', text: 'Erro ao buscar agendamentos' });
      setLoading(false);
    }
  };

  const atendimentosRealizados = async () => {
    try {
      setLoading(true);
      const data = await realizados();
      setAtendimentos(data);
      setLoading(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao buscar agendamentos realizados:',
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const buscarCliente = async (query) => {
    try {
      setLoading(true);
      const data = await buscaCliente(query);
      setCliente(data.paciente); // Agora salva uma lista de pacientes
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Cliente não encontrado' });
      setCliente([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarHistoricoCliente = async (id) => {
    try {
      setLoading(true);
      const response = await buscarAtendimentosCliente(id);

      if (response.status === 200 && response.historico) {
        setHistorico(response.historico); // Atualiza o estado com os dados retornados
      } else {
        setHistorico([]); // Se não houver histórico, limpa a lista
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Não possui histórico',
      });
      setHistorico([]); // Se houver erro, limpa o histórico
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (funcionario) {
      carregarAgenda();
      // atendimentosRealizados();
    }
  }, [funcionario]);

  return (
    <AgendaContext.Provider
      value={{
        setAgenda,
        setCliente,
        setMessage,
        setHistorico,
        agenda,
        loading,
        message,
        carregarAgenda,
        atendimentosRealizados,
        atendimentos,
        buscarCliente,
        cliente,
        historico,
        buscarHistoricoCliente,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};
