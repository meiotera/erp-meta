import apiFetch from './api';
import authToken from '../src/utils/authToken';
import { jwtDecode } from 'jwt-decode';

export const cadastrarCliente = async (formData) => {
  try {
    const token = authToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }

    const decodedToken = jwtDecode(token);
    const idFuncionario = decodedToken.id; //

    const dadosCliente = {
      ...formData,
      funcionario: idFuncionario,
    };

    const response = await apiFetch('/clientes/cadastrar-cliente', {
      method: 'POST',
      body: JSON.stringify(dadosCliente),
    });
    return response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
