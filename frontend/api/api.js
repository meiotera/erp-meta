import authToken from '../src/utils/authToken';

const baseURL = process.env.BACKEND_URL;

const apiFetch = async (url, options = {}) => {
  const token = authToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || 'Erro na requisição');
    error.status = response.status;
    error.errors = errorData.errors;
    throw error;
  }

  return response;
};

export default apiFetch;
