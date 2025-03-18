import authToken from '../src/utils/authToken';

export const cadastrarCliente = async (formData) => {
  try {

    const token = authToken()

    const response = await fetch(
      'http://localhost:3000/clientes/cadastrar-cliente',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      },
    );
    const data = response;
 
    return data;
   
  } catch (error) {
    console.error(error.message);
  } 
};