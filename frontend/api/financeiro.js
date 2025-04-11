import apiFetch from './api';

export const fetchDadosFinanceiros = async (dataInicial, dataFinal) => {
  try {
    const response = await apiFetch('/financeiro', {
      method: 'POST',
      body: JSON.stringify({ dataInicial, dataFinal }),
    });
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error);
    throw error;
  }
};
