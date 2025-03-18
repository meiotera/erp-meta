export const agendarAtendimento = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/agenda/agendamentos', {
            method: 'POST',
            credentials: 'include', // Certifica-se de que os cookies de sessão sejam enviados
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });   

        if (!response.ok) {
            throw new Error('Erro ao agendar atendimento');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao agendar atendimento:', error);
        throw error;
    }
};
