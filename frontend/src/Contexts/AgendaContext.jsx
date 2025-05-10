// /home/renan/erp-meta/frontend/src/Contexts/AgendaContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { LoginContext } from './LoginContext';
import { minhaAgenda, realizados, criarAgenda } from '../../api/minhaAgenda';
import { excluirAgendamento } from '../../api/agendamento';
import {
  buscaCliente,
  buscarAtendimentosCliente,
} from '../../api/buscaCliente';
import { cadastrarCliente } from '../../api/cadastroCliente';

import authToken from '../../src/utils/authToken';
import { jwtDecode } from 'jwt-decode';

export const AgendaContext = createContext();

export const AgendaProvider = ({ children }) => {
  const { funcionario } = useContext(LoginContext);
  const [agenda, setAgenda] = useState({ agenda: [], agendamentos: [] });
  const [atendimentos, setAtendimentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const carregarAgenda = useCallback(async () => {
    try {
      setLoading(true);
      const data = await minhaAgenda();
      setAgenda({
        agenda: data.agenda || [],
        agendamentos: data.agendamentos || [],
      });

      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao buscar agendamentos' });
      setLoading(false);
    }
  }, []);

  const deleteAgendamento = async (id) => {
    try {
      setLoading(true);
      const response = await excluirAgendamento(id);

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Agendamento deletado com sucesso!',
        });
        carregarAgenda();
      } else {
        setMessage({ type: 'error', text: 'Erro ao deletar agendamento.' });
      }
    } catch (error) {
      console.log('Erro ao deletar agendamento:', error);
    } finally {
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

  const criarNovaAgenda = async (registros) => {
    try {
      const token = authToken();

      const decodedToken = jwtDecode(token);
      const idFuncionario = decodedToken.id;

      const { agenda } = registros;

      setLoading(true);
      const novaAgenda = await criarAgenda({
        id_funcionario: idFuncionario,
        agenda,
      });
      carregarAgenda();
      setMessage({ type: 'success', text: 'Agenda criada com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar nova agenda' });
    } finally {
      setLoading(false);
    }
  };

  const cadastrarClientePost = async (dados) => {
    try {
      setLoading(true);
      const response = await cadastrarCliente(dados);

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Cliente cadastrado com sucesso!',
        });
      } else {
        setMessage({ type: 'error', text: 'Erro ao cadastrar cliente.' });
      }
      carregarAgenda(); // Atualiza a agenda no frontend
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setMessage({ type: 'error', text: 'Erro ao cadastrar cliente.' });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (funcionario) {
      carregarAgenda();
    }
  }, [funcionario, carregarAgenda]);

  return (
    <AgendaContext.Provider
      value={{
        setAgenda,
        setCliente,
        setMessage,
        setHistorico,
        cadastrarClientePost,
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
        criarNovaAgenda,
        deleteAgendamento,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};
