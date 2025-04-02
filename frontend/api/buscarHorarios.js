import api from './api';

export const buscarHorarios = async () => {
  try {
    const response = await api.get('/agenda/horarios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};
