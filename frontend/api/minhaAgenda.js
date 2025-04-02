// /home/renan/erp-meta/frontend/api/minhaAgenda.js
import apiFetch from './api';

export const minhaAgenda = async () => {
  try {
    const response = await apiFetch('/agenda');
    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar agenda:', error);
    throw error;
  }
};

export const realizados = async () => {
  try {
    const response = await apiFetch('/agenda/realizados');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar realizados:', error);
    throw error;
  }
};

export const criarAgenda = async (data) => {
  try {
    const response = await apiFetch('/criar-agenda', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao criar agenda:', error);
    throw error;
  }
};

// Removed: export const buscarHorarios = async () => { ... };
