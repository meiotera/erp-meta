const mongoose = require('mongoose');
const Agendamento = require('../models/Agendamento');
const Agenda_Especialista = require('../models/Agenda_Especialista');
const disponibilidadeAgenda = require('../utilities/disponibilidade_agenda');

const {
  validarCPF,
  buscarFuncionarioECliente,
  criarRespostaErro,
} = require('../utilities/utils');
const moment = require('moment-timezone');

function converterStringParaData(dataString) {
  return new Date(dataString);
}

exports.agendar_atendimento = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nome, telefone, email, cpf, agendamentos, funcionario } = req.body;
    const telefoneFormatado = telefone.replace(/\D/g, '');

    const cpf_validado = await validarCPF(cpf);
    if (!cpf_validado) return criarRespostaErro(res, 400, 'CPF inválido.');
    if (!telefoneFormatado || !agendamentos || agendamentos.length === 0)
      return criarRespostaErro(
        res,
        400,
        'Todos os campos obrigatórios devem ser preenchidos.',
      );

    const agendamentosCriados = [];

    const disponibilidade = await disponibilidadeAgenda(
      req,
      res,
      funcionario,
      cpf_validado.cpf,
      agendamentos,
    );

    for (const agendamento of agendamentos) {
      const { data, hora } = agendamento;
      const { funcionario: funcionarioEncontrado, cliente } =
        await buscarFuncionarioECliente(funcionario, cpf_validado.cpf);

      if (!funcionarioEncontrado) {
        await session.abortTransaction();
        session.endSession();
        return criarRespostaErro(res, 404, 'Especialista não encontrado.');
      }

      if (disponibilidade.type === 'error') {
        await session.abortTransaction();
        session.endSession();
        return criarRespostaErro(res, 400, disponibilidade.message);
      }

      const dataConvertida = converterStringParaData(data);

      const atualizado = await Agenda_Especialista.updateOne(
        {
          funcionario,
          'agenda.data': dataConvertida,
          'agenda.horariosDisponiveis.horario': hora,
        },
        {
          $set: {
            'agenda.$[outer].horariosDisponiveis.$[inner].disponivel': false,
          },
        },
        {
          arrayFilters: [
            { 'outer.data': dataConvertida },
            { 'inner.horario': hora },
          ],
          session,
        },
      );

      if (atualizado.modifiedCount === 0) {
        await session.abortTransaction();
        session.endSession();
        return criarRespostaErro(
          res,
          400,
          'Horário não disponível para agendamento.',
        );
      }

      // Criação do agendamento com a sessão ativa
      const novoAgendamento = await Agendamento.create(
        [
          {
            isCadastrado: !!cliente,
            cliente: cliente ? cliente._id : null,
            nome,
            funcionario: funcionarioEncontrado._id,
            cpf: cpf_validado.cpf,
            data: dataConvertida,
            hora,
            telefone: telefoneFormatado,
            email,
          },
        ],
        { session },
      );

      agendamentosCriados.push(novoAgendamento[0]);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 200,
      message: 'Atendimento agendado com sucesso.',
      agendamentos: agendamentosCriados.map((agendamento) => agendamento._id),
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return criarRespostaErro(
      res,
      500,
      'Erro ao criar agendamento: ' + error.message,
    );
  }
};

exports.meus_agendamentos = async (req, res, next, skip, limit) => {
  try {
    const funcionarioId = req.funcionario.id;

    const agendamentos = await Agendamento.find({
      funcionario: funcionarioId,
    })
      .select('nome cpf telefone data hora email isCadastrado')
      .sort({
        data: 1,
        hora: 1,
      })
      .skip(skip)
      .limit(limit)
      .populate('cliente');

    return agendamentos;
  } catch (error) {
    return next(new Error('Erro ao listar agendamentos: ' + error.message));
  }
};

exports.buscar_agendamento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agendamento = await Agendamento.findById(id).populate('cliente');

    if (!agendamento) {
      return criarRespostaErro(res, 404, 'Agendamento não encontrado.');
    }

    res.status(200).json({
      status: 200,
      agendamento,
    });
  } catch (error) {
    return criarRespostaErro(res, 500, 'Erro ao buscar agendamento.');
  }
};

exports.delete_agendamento = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const agendamento = await Agendamento.findByIdAndDelete(id);

    if (agendamento) {
      res.status(200).json({
        status: 200,
        mensagem: 'Agendamento excluído com sucesso!',
      });
    }
  } catch (error) {}
};
