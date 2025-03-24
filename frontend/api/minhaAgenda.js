import authToken from '../src/utils/authToken';

export const minhaAgenda = async () => {
  try {
    const token = authToken();

    const response = await fetch(`http://localhost:3000/agenda`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Adiciona o token JWT
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Erro ao buscar agendamentos');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw error;
  }
};

export const realizados = async () => {
  try {
    const token = authToken();

    const response = await fetch(`http://localhost:3000/meus-atendimentos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Adiciona o token JWT
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Sem atendimentos realizados');
    }

    return await response.json();
  } catch (error) {
    console.error('Não foi possivel', error);
    throw error;
  }
};
