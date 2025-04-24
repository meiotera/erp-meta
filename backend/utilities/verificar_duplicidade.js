const Agendamento = require('../models/Agendamento');

async function verificar_duplicidade(cliente, req) {
  try {
    const { data, hora, funcionario_id } = req.body;

    // Buscar agendamentos do cliente
    const agendamentos = await Agendamento.find({
      cpf: cliente.cpf,
    });

    if (agendamentos.length === 0) {
      return false;
    }

    // Verificar duplicidade de agendamento
    const isDuplicated = agendamentos.some(
      (agendamento) =>
        agendamento.dia && // Verifica se agendamento.dia está definido
        agendamento.dia.toISOString().split('T')[0] ===
          new Date(data).toISOString().split('T')[0] &&
        agendamento.periodo === hora &&
        (!funcionario_id ||
          agendamento.funcionario.toString() === funcionario_id),
    );

    return isDuplicated;
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return false;
  }
}

module.exports = verificar_duplicidade;
