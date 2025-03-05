export const listarFuncionarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/');
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

export const listarDataseHorarios = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/especialista/${id}/dias-horarios`);
        if (!response.ok) {
            throw new Error('Erro ao buscar agenda');
        }
        const data = await response.json();

        return { agenda: data.agenda, status: data.status, message: data.message };
    } catch (error) {
        console.error('Erro ao buscar agenda:');
        throw error;
    }
};
