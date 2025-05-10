const Agenda_Especialista = require('../models/Agenda_Especialista');
const mongoose = require('mongoose');

exports.criar_agenda = async (req, res, next) => {
  try {
    const { id_funcionario, agenda } = req.body;

    if (!id_funcionario || !agenda) {
      return res.status(400).send({
        message: 'id_funcionario e agenda são obrigatórios.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_funcionario)) {
      return res.status(400).send({
        message: 'ID do funcionário inválido.',
      });
    }

    let existeAgenda = await Agenda_Especialista.findOne({
      funcionario: id_funcionario,
    });

    if (existeAgenda) {
      if (
        !Array.isArray(agenda) ||
        agenda.some(
          (item) => !item.data || !Array.isArray(item.horariosDisponiveis),
        )
      ) {
        return res.status(400).send({
          message: 'Dados da agenda inválidos.',
        });
      }

      const novaAgenda = [...existeAgenda.agenda];

      agenda.forEach((novoItem) => {
        const novaData = new Date(novoItem.data);
        const index = novaAgenda.findIndex(
          (item) => new Date(item.data).getTime() === novaData.getTime(),
        );
        if (index !== -1) {
          novoItem.horariosDisponiveis.forEach((novoHorario) => {
            const horarioIndex = novaAgenda[
              index
            ].horariosDisponiveis.findIndex(
              (horario) => horario.horario === novoHorario.horario,
            );
            if (horarioIndex !== -1) {
              novaAgenda[index].horariosDisponiveis[horarioIndex].disponivel =
                novoHorario.disponivel;
            } else {
              novaAgenda[index].horariosDisponiveis.push(novoHorario);
            }
          });
        } else {
          novaAgenda.push(novoItem);
        }
      });

      existeAgenda.agenda = novaAgenda;

      try {
        await existeAgenda.save();
        res.status(200).send({
          status: 'success',
          message: 'Agenda atualizada com sucesso.',
          agendaId: existeAgenda.id,
        });
      } catch (saveError) {
        console.error('Erro ao salvar a agenda existente:', saveError);
        res.status(500).send({
          status: 'error',
          message: 'Erro ao salvar a agenda. Verifique os dados informados.',
          error: saveError.message,
        });
      }
    } else {
      const novaAgenda = new Agenda_Especialista({
        agenda: agenda,
        funcionario: id_funcionario,
      });

      try {
        await novaAgenda.save();
        res.status(201).send({
          status: 'success',
          message: 'Agenda criada com sucesso.',
          agendaId: novaAgenda.id,
        });
      } catch (saveError) {
        console.error('Erro ao salvar a nova agenda:', saveError);
        res.status(500).send({
          status: 'error',
          message: 'Erro ao salvar a nova agenda.',
          error: saveError.message,
        });
      }
    }
  } catch (error) {
    console.error('Erro no controlador criar_agenda:', error);
    res.status(500).send({
      status: 'error',
      message: 'Erro ao criar/atualizar a agenda.',
      error: error.message,
    });
  }
};
