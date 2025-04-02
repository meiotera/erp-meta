import apiFetch from './api';

export const buscaCliente = async (query) => {
  try {
    const response = await apiFetch(`/clientes/buscar-cliente`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const buscarAtendimentosCliente = async (idCliente) => {
  try {
    const response = await apiFetch(
      `/atendimento/buscar-historico-cliente/${idCliente}`,
    );
    return response.json();
  } catch (error) {
    throw error;
  }
};
