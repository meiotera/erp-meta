import apiFetch from './api';

export const agendarAtendimento = async (data) => {
  try {
    const response = await apiFetch('/agenda/agendamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error('Erro ao agendar atendimento:', error);
    throw error;
  }
};

export const agendarAtendimentoInterno = async (agendamentoData) => {
  try {
    const response = await apiFetch.post('/agendamento', agendamentoData);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao agendar atendimento interno:',
      error.response?.data || error.message,
    );
    throw error.response?.data || new Error('Falha ao agendar atendimento');
  }
};

export const excluirAgendamento = async (agendamentoId) => {
  try {
    const response = await apiFetch(`/agenda/agendamento/${agendamentoId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    throw error;
  }
};
