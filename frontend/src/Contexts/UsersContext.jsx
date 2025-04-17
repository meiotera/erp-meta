import React, { createContext, useEffect, useState } from 'react';
import {
  listarFuncionarios,
  listarDataseHorarios,
  buscarFuncionario,
  updateFuncionario,
  cadastrarFuncionario,
} from '../../api/funcionario';
import { agendarAtendimento } from '../../api/agendamento';
import { fetchDadosFinanceiros } from '../../api/financeiro';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioEncontrado, setFuncionarioEncontrado] = useState(null); // []
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [funcionarioId, setFuncionarioId] = useState(null);
  const [message, setMessage] = useState(null);
  const [isFetched, setIsFetched] = useState(false); // Controle de requisições

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

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

  const buscarDadosFuncionario = async (id) => {
    try {
      setLoading(true);
      const data = await buscarFuncionario(id);
      setFuncionarioEncontrado(data);
      setLoading(false);
    } catch {
      setMessage({
        type: 'error',
        text: 'Erro ao buscar dados do funcionário',
      });
      setLoading(false);
    }
  };

  const postAgendamento = async (data) => {
    setLoading(true);
    setMessage(null); // Limpa mensagens de erro do formulário
    setShowSuccessModal(false); // Garante que o modal de sucesso esteja fechado
    setSuccessModalMessage('');
    try {
      const response = await agendarAtendimento(data);
      if (response.status === 200 && response.message) {
        setSuccessModalMessage(response.message);
        setShowSuccessModal(true);
        setLoading(false);
        return true;
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Ocorreu um erro inesperado.',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao agendar atendimento' });
    }
  };

  const cadastraFuncionario = async (data) => {
    try {
      const response = await cadastrarFuncionario(data);
      if (response.status === 'success') {
        // setMessage({ type: 'success', text: response.message });
        setSuccessModalMessage(response.message);
        setShowSuccessModal(true);
        setLoading(false);
        return true;
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      console.log(error);
      setMessage({ type: 'error', text: 'Erro ao cadastrar funcionário' });
    }
  };

  const updateDadosFuncionario = async (data) => {
    try {
      const response = await updateFuncionario(data);
      if (response.status === 'success') {
        setMessage({ type: 'success', text: response.message });
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar dados' });
    }
  };

  const fetchFinanceiro = async (dataInicial, dataFinal) => {
    // setLoading(true); // Você pode manter o loading aqui se preferir
    try {
      // 1. Chame a função da API, que DEVE retornar os dados JSON parseados
      const dadosJson = await fetchDadosFinanceiros(dataInicial, dataFinal);

      console.log('da', dadosJson);

      return dadosJson;
    } catch (error) {
      console.error('Erro ao buscar dados financeiros no Context:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao buscar dados financeiros',
      });
      // Retorne um array vazio ou null em caso de erro para o componente lidar
      return []; // Retornar array vazio é mais seguro para .map
    } finally {
      // setLoading(false); // Pode manter o loading aqui
    }
  };

  return (
    <UsersContext.Provider
      value={{
        funcionarios,
        setFuncionarios,
        funcionarioEncontrado,
        loading,
        setLoading,
        agenda,
        setAgenda,
        fetchAgenda,
        postAgendamento,
        message,
        setMessage,
        funcionarioId,
        buscarDadosFuncionario,
        updateDadosFuncionario,
        cadastraFuncionario,
        fetchFinanceiro, // Adicionado ao contexto
        showSuccessModal,
        setShowSuccessModal,
        successModalMessage,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
