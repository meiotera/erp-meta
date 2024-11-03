const Atendimento = require("../models/Atendimento");
const Agendamento = require("../models/Agendamento");
const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Types;
const { criarRespostaErro } = require("../utilities/utils");
// const Funcionario = require('../models/Funcionarios');

exports.atendimento = async (req, res, next) => {
  try {
    const {
      recursos,
      observacao,
      encaminhamento,
      medicacao,
      objetivo,
      cliente,
      funcionario,
      valor,
      agendamento,
    } = req.body;

    // Validação dos campos cliente e funcionario
    if (!ObjectId.isValid(cliente)) {
      return res.status(400).json(criarRespostaErro("ID do cliente inválido"));
    }

    if (!ObjectId.isValid(funcionario)) {
      return res
        .status(400)
        .json(criarRespostaErro("ID do funcionário inválido"));
    }

    // Sanitização dos dados de entrada
    const sanitizedRecursos = validator.escape(recursos.trim());
    const sanitizedObservacao = validator.escape(observacao.trim());
    const sanitizedEncaminhamento = validator.escape(encaminhamento.trim());
    const sanitizedMedicacao = validator.escape(medicacao.trim());
    const sanitizedObjetivo = validator.escape(objetivo.trim());
    const sanitizedValor = validator.escape(valor.trim());

    const atendimento = await Atendimento.create({
      recursos: sanitizedRecursos,
      observacao: sanitizedObservacao,
      encaminhamento: sanitizedEncaminhamento,
      medicacao: sanitizedMedicacao,
      objetivo: sanitizedObjetivo,
      valor: sanitizedValor,
      cliente,
      funcionario,
      agendamento,
      realizado: true,
    });

    res.status(200).json({
      status: 200,
      message: "Atendimento criado com sucesso.",
      atendimento,
    });
  } catch (error) {
    return criarRespostaErro(res, 500, "Erro ao criar atendimento");
  }
};

// Buscar histórico de atendimentos de um cliente
exports.getHistoricoCliente = async (req, res, next) => {
  try {
    const { id_cliente } = req.params;

    if (!ObjectId.isValid(id_cliente)) {
      return res.status(400).json(criarRespostaErro("ID do cliente inválido"));
    }

    const historico = await Atendimento.find({
      cliente: id_cliente,
    }).populate("agendamento");

    const dadosFiltrados = historico.map((atendimento) => {
      return {
        recursos: atendimento.recursos,
        observacao: atendimento.observacao,
        encaminhamento: atendimento.encaminhamento,
        medicacao: atendimento.medicacao,
        objetivo: atendimento.objetivo,
        agendamento: atendimento.agendamento,
        data: atendimento.create_at,
      };
    });

    return dadosFiltrados;
  } catch (error) {
    return criarRespostaErro(res, 500, "Erro ao buscar histórico do cliente");
  }
};
