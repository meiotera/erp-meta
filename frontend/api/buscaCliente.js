import authToken from '../src/utils/authToken';

export const buscaCliente = async (query) => {
  try {
    const token = authToken();
    // router.post("/buscar-cliente", protect, cliente_controller.buscar_paciente);
    const response = await fetch(
      `http://localhost:3000/clientes/buscar-cliente`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Adiciona o token JWT
        },
        body: JSON.stringify({ query }), // Envia o formData como JSON
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      const error = new Error(
        errorData.message || 'Verifique os dados digitados.',
      );
      error.errors = errorData.errors;
      throw error;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
export const buscarAtendimentosCliente = async (idCliente) => {
  try {
    const token = authToken();
    const response = await fetch(
      `http://localhost:3000/atendimento/buscar-historico-cliente/${idCliente}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Adiciona o token JWT
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();

      const error = new Error(
        errorData.message || 'Não foi encontrado histórico.',
      );
      error.errors = errorData.errors;
      throw error;
    }

    const data = await response.json(); // 🚀 Corrigido: Agora extraímos o JSON corretamente

    return data; // Retornamos os dados corretamente
  } catch (error) {
    throw error;
  }
};
