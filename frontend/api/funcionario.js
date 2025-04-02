import apiFetch from './api';

export const listarFuncionarios = async () => {
  try {
    const response = await apiFetch('/');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    throw error;
  }
};

export const listarDataseHorarios = async (id) => {
  try {
    const response = await apiFetch(`/especialista/${id}/dias-horarios`);
    const data = await response.json();
    return { agenda: data.agenda, status: data.status, message: data.message };
  } catch (error) {
    console.error('Erro ao buscar agenda:', error);
    throw error;
  }
};
