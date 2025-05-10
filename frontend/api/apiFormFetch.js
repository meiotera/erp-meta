import authToken from '../src/utils/authToken';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const apiFormFetch = async (url, options = {}) => {
  const token = authToken();

  const headers = options.headers || {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      console.error('Erro ao analisar a resposta JSON:', e);
    }

    const error = new Error(errorData.message || 'Erro na requisição');
    error.status = response.status;
    error.errors = errorData.errors;
    throw error;
  }

  return response;
};

export default apiFormFetch;
