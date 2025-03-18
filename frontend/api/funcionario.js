export const listarFuncionarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }
        const data = await response.json();       

        const funcionarios = data.funcionarios.map((funcionario) => {
            return {
                id: funcionario.id,
                nome: funcionario.nome,
                descricao: funcionario.descricao,
                foto: funcionario.foto,
                instagram: funcionario.instagram,
                profissao: funcionario.profissao,
                telefone: funcionario.telefone,
                valor_consulta: funcionario.valor_consulta,
            }
        })

        return funcionarios;
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
