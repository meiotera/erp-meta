const Atendimento = require('../models/Atendimento');
const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Types;
const { criarRespostaErro } = require('../utilities/utils');

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
        message: 'ID do cliente inválido',
      });
    }

    if (!ObjectId.isValid(funcionario)) {
      return res.status(400).json({
        status: 400,
        message: 'ID do funcionário inválido',
      });
    }

    const atendimento = new Atendimento({
      objetivo,
      recursos,
      observacao,
      encaminhamento,
      medicacao,
      valor,
      cliente,
      funcionario,
      agendamento,
      realizado: true,
    });

    await atendimento.save();

    res.status(200).json({
      status: 200,
      message: 'Atendimento criado com sucesso.',
      atendimento,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.log('back', errors);
      return res.status(400).json({
        status: 400,
        message: 'Erro de validação',
        errors,
      });
    }
    return res.status(500).json({
      status: 500,
      message: 'Erro ao criar atendimento.',
    });
  }
};

// Buscar histórico de atendimentos de um cliente
exports.getHistoricoCliente = async (req, res, next) => {
  try {
    const { id_cliente } = req.params;

    if (!ObjectId.isValid(id_cliente)) {
      return res
        .status(400)
        .json({ status: 400, message: 'ID do cliente inválido' });
    }

    const historico = await Atendimento.find({ cliente: id_cliente })
      .populate('agendamento')
      .lean(); // Retorna um objeto JavaScript puro

    if (!historico || historico.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: 'Nenhum atendimento encontrado' });
    }

    // Retorna os dados corretamente
    res.status(200).json({
      status: 200,
      historico: historico.map((atendimento) => ({
        recursos: atendimento.recursos,
        observacao: atendimento.observacao,
        encaminhamento: atendimento.encaminhamento,
        medicacao: atendimento.medicacao,
        objetivo: atendimento.objetivo,
        data: atendimento.createdAt, // Certifique-se de que `createdAt` existe
        agendamento: atendimento.agendamento
          ? {
              data: atendimento.agendamento.data,
              horario: atendimento.agendamento.horario,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return res
      .status(500)
      .json({ status: 500, message: 'Erro ao buscar histórico do cliente' });
  }
};
