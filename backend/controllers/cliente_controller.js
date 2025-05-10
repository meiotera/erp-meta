const Cliente = require('../models/Clientes');
const Agendamento = require('../models/Agendamento');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { validarCPF, criarRespostaErro } = require('../utilities/utils');

exports.cadastrar_cliente = async (req, res, next) => {
  try {
    const {
      nome,
      dataNascimento,
      telefone,
      email,
      responsavel,
      cpf,
      funcionario,
      id_agendamento,
    } = req.body;

    const cpf_validado = await validarCPF(cpf);
    if (cpf_validado.type === 'error') {
      return criarRespostaErro(res, 400, cpf_validado.message);
    }

    const newCliente = await Cliente.create({
      nome,
      dataNascimento,
      telefone,
      email,
      responsavel,
      cpf: cpf_validado.cpf,
      funcionario,
      isCadastrado: true,
    });

    if (id_agendamento && mongoose.Types.ObjectId.isValid(id_agendamento)) {
      await Agendamento.findByIdAndUpdate(id_agendamento, {
        cliente: newCliente._id,
        isCadastrado: true,
      });
    } else if (id_agendamento) {
      return criarRespostaErro(res, 400, 'ID de agendamento inválido.');
    }

    res.status(200).send({
      message: 'Cliente cadastrado com sucesso.',
      clienteId: newCliente._id,
    });
  } catch (error) {
    return criarRespostaErro(
      res,
      500,
      'Erro ao cadastrar cliente: ' + error.message,
    );
  }
};

exports.listar_clientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find().select('-id -__v -created_at');

    res.status(200).send(clientes);
  } catch (error) {
    next(error);
  }
};

exports.listar_meus_pacientes = async (req, res, next) => {
  try {
    const funcionario = req.funcionario.id;

    const clientes = await Cliente.find({
      funcionario,
    }).select('-id -__v -created_at');

    // ordenar por nome
    const clientesEmOrdem = clientes.sort((a, b) => {
      if (a.nome < b.nome) {
        return -1;
      }
      if (a.nome > b.nome) {
        return 1;
      }
      return 0;
    });

    return clientesEmOrdem;
  } catch (error) {
    next(error);
  }
};

exports.buscar_paciente = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        status: 400,
        message: 'Digite pelo menos 3 caracteres para buscar.',
      });
    }

    const paciente = await Cliente.find({
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { cpf: { $regex: `^${query}`, $options: 'i' } },
      ],
    }).limit(10);

    if (!paciente.length) {
      return res
        .status(404)
        .json({ status: 404, message: 'Paciente não encontrado' });
    }

    res.status(200).json({ status: 200, paciente: paciente });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Erro ao buscar paciente',
      error: error.message,
    });
  }
};

exports.delete_cliente = async (req, res, next) => {
  const cliente = await Cliente.findByIdAndDelete(req.params.id);

  if (!cliente) {
    return res.status(404).send({
      message: 'Cliente não encontrado.',
    });
  }

  res.status(200).send({
    message: 'Cliente deletado com sucesso.',
  });
};

exports.update_cliente = async (req, res, next) => {
  const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cliente) {
    return res.status(404).send({
      message: 'Cliente não encontrado.',
    });
  }

  res.status(200).send({
    message: 'Cliente atualizado com sucesso.',
  });
};
