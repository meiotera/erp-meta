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

export const updateFuncionario = async (data, funcionarioId) => {
  try {
    const response = await apiFetch('/funcionarios/update-especialista', {
      method: 'PATCH',
      body: JSON.stringify(data, funcionarioId),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
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

export const buscarFuncionario = async (id) => {
  try {
    const response = await apiFetch(`/funcionarios/buscar-especialista/${id}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    throw error;
  }
};
