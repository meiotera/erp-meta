const Atendimento = require("../models/Atendimento");
const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Types;
const { criarRespostaErro } = require("../utilities/utils");

exports.atendimento = async (req, res, next) => {
  try {
    const {
      objetivo,
      recursos,
      observacao,
      encaminhamento,
      medicacao,
      funcionario,
      agendamento,
      cliente,
      valor,
    } = req.body;

    // Validação dos campos cliente e funcionario
    if (!ObjectId.isValid(cliente)) {
      return res.status(400).json({
        status: 400,
        message: "ID do cliente inválido",
      });
    }

    if (!ObjectId.isValid(funcionario)) {
      return res.status(400).json({
        status: 400,
        message: "ID do funcionário inválido",
      });
    }

    // Sanitização dos dados de entrada
    const sanitizedRecursos = validator.escape(recursos.trim());
    const sanitizedObservacao = validator.escape(observacao.trim());
    const sanitizedEncaminhamento = validator.escape(encaminhamento.trim());
    const sanitizedMedicacao = validator.escape(medicacao.trim());
    const sanitizedObjetivo = validator.escape(objetivo.trim());
    const sanitizedValor = validator.escape(valor.trim());

    const atendimento = new Atendimento({
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

    await atendimento.save();

    res.status(200).json({
      status: 200,
      message: "Atendimento criado com sucesso.",
      atendimento,
    });
  } catch (error) {
    console.log(error.name === 'ValidationError');
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 400,
        message: "Erro de validação",
        errors,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Erro ao criar atendimento.",
    });
  }
};