export const listarFuncionarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/');
        console.log|(response)
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
};