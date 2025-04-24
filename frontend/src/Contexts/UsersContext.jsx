import React, { createContext, useEffect, useState } from 'react';
import {
  listarFuncionarios,
  listarDataseHorarios,
  buscarFuncionario,
  updateFuncionario,
  cadastrarFuncionario,
  updateSenha,
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
  const [isFetched, setIsFetched] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      if (isFetched) return;
      try {
        const data = await listarFuncionarios();
        setFuncionarios(data);
        setIsFetched(true);
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

  const updateSenhaFuncionario = async (id, passwordData) => {
    setPasswordLoading(true);
    setPasswordMessage(null);
    setMessage(null);
    try {
      const response = await updateSenha(id, passwordData);

      if (response.status === 'success') {
        setPasswordMessage({ type: 'success', text: response.message });

        return true;
      } else {
        setPasswordMessage({
          type: 'error',
          text: response.message || 'Erro ao atualizar senha.',
        });
        return false;
      }
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.message || 'Erro inesperado ao atualizar senha.',
      });
      return false;
    } finally {
      setPasswordLoading(false);
      // setPasswordMessage(null);
    }
  };

  const postAgendamento = async (data) => {
    setLoading(true);
    setMessage(null);
    setShowSuccessModal(false);
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
        setSuccessModalMessage(response.message);
        setShowSuccessModal(true);
        setLoading(false);
        return true;
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
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
    try {
      const dadosJson = await fetchDadosFinanceiros(dataInicial, dataFinal);

      return dadosJson;
    } catch (error) {
      console.error('Erro ao buscar dados financeiros no Context:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao buscar dados financeiros',
      });

      return [];
    } finally {
      setLoading(false);
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
        fetchFinanceiro,
        showSuccessModal,
        setShowSuccessModal,
        successModalMessage,
        updateSenhaFuncionario,
        passwordLoading,
        passwordMessage,
        setPasswordMessage,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
