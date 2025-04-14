const Funcionarios = require('../models/Funcionarios');
const fs = require('fs');
const path = require('path');

const { criarRespostaErro } = require('../utilities/utils');

const filterObj = (obj, ...camposPermitidos) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (camposPermitidos.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.listar_funcionarios = async (req, res, next) => {
  try {
    const funcionarios = await Funcionarios.find();

    res.status(200).send(funcionarios);
  } catch (error) {
    next(error);
  }
};

exports.cadastro_especialista = async (req, res, next) => {
  try {
    const newFuncionario = await Funcionarios.create({
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      profissao: req.body.profissao,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      role: req.body.role,
      descricao: req.body.descricao,
    });

    res.status(201).json({
      status: 'success',
      message: 'Especialista cadastrado com sucesso.',
      funcionarioId: newFuncionario.id,
    });
  } catch (error) {
    next(error);
  }
};

exports.buscar_especialista = async (req, res, next) => {
  try {
    const { id } = req.params;
    const especialista = await Funcionarios.findById(id);

    if (!especialista) {
      return res.status(404).send({
        status: 'fail',
        message: 'Especialista não encontrado.',
      });
    }

    res.status(200).send({
      status: 'success',
      data: {
        especialista,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.update_especialista = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirm_password) {
      return res.status(400).send({
        status: 'fail',
        message: 'Não é possível atualizar a senha por aqui.',
      });
    }

    // Filtra os campos permitidos
    const filteredBody = filterObj(
      req.body,
      'nome',
      'telefone',
      'profissao',
      'email',
      'descricao',
      'instagram',
      'valor_consulta',
      'foto',
    );

    const updatedFuncionario = await Funcionarios.findByIdAndUpdate(
      req.body._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedFuncionario) {
      return res.status(404).send({
        status: 'fail',
        message: 'Especialista não encontrado para atualização.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        funcionario: updatedFuncionario,
      },
      message: 'Especialista atualizado com sucesso.',
    });
  } catch (error) {
    next(error);
  }
};
