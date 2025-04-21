import apiFetch from './api';

export const login = async (data) => {
  try {
    const response = await apiFetch('/funcionarios/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
};
