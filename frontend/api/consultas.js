import apiFetch from './api';
import authToken from '../src/utils/authToken';
import { jwtDecode } from 'jwt-decode';

export const salvarConsulta = async (formData) => {
  try {
    const token = authToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }

    const decodedToken = jwtDecode(token);
    const idFuncionario = decodedToken.id; //

    const dataComFuncionario = {
      ...formData,
      funcionario: idFuncionario,
    };

    const response = await apiFetch(`/atendimento`, {
      method: 'POST',
      body: JSON.stringify(dataComFuncionario),
    });

    return response;
  } catch (error) {
    if (error.errors) {
      throw { errors: error.errors };
    }

    throw new Error('Erro ao salvar a consulta');
  }
};
