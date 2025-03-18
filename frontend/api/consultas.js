import authToken from '../src/utils/authToken';

export const salvarConsulta = async (formData) => {
  try {
    const token = authToken();

    const response = await fetch(`http://localhost:3000/atendimento`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Adiciona o token JWT
      },
      body: JSON.stringify(formData), // Envia o formData como JSON
    });

    if (!response.ok) {
      const errorData = await response.json();

      const error = new Error(errorData.message || 'Erro ao salvar consulta');
      error.errors = errorData.errors;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};