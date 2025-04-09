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
