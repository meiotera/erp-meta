const Agendamento = require("../models/Agendamento");

async function verificar_duplicidade(cliente, req) {
    try {
        const {
            data,
            hora,
            funcionario_id
        } = req.body;

        console.log('Cliente', cliente);
        // Buscar agendamentos do cliente
        const agendamentos = await Agendamento.find({
            cpf: cliente.cpf
        });

        console.log('Agendamentos', agendamentos);

        if (agendamentos.length === 0) {
            console.log("Nenhum agendamento encontrado para o ID do cliente:", cliente._id);
            return false;
        }

        // Verificar duplicidade de agendamento
        const isDuplicated = agendamentos.some(agendamento =>
            agendamento.dia && // Verifica se agendamento.dia está definido
            agendamento.dia.toISOString().split('T')[0] === new Date(data).toISOString().split('T')[0] &&
            agendamento.periodo === hora &&
            (!funcionario_id || agendamento.funcionario.toString() === funcionario_id)
        );

        return isDuplicated;
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return false;
    }
}

module.exports = verificar_duplicidade;