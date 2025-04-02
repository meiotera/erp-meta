import apiFetch from './api';

export const login = async (data) => {
  try {
    const response = await apiFetch('/funcionarios/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log(response);
    return response.json(); // Corrigido: Retorna os dados em JSON
  } catch (error) {
    throw error;
  }
};
