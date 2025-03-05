import axios from 'axios';

// Configuração global do Axios
axios.defaults.withCredentials = true;

// Interceptor para adicionar o token CSRF
axios.interceptors.request.use(async (config) => {
    if (!config.headers['X-CSRF-Token']) {
        try {
            const response = await axios.get('http://localhost:3000/csrf-token', { withCredentials: true });
            config.headers['X-CSRF-Token'] = response.data.csrfToken;
        } catch (error) {
            console.error('Erro ao obter token CSRF', error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axios;
