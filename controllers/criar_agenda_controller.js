const Agenda_Especialista = require("../models/Agenda_Especialista");
const mongoose = require("mongoose");

exports.criar_agenda = async (req, res, next) => {
  try {
    const { id_funcionario, agenda } = req.body;

    // Verifica se o ID do funcionário é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_funcionario)) {
      return res.status(400).send({
        message: "ID do funcionário inválido.",
      });
    }

    // Procurar uma agenda existente para o funcionário
    let existeAgenda = await Agenda_Especialista.findOne({
      funcionario: id_funcionario,
    });

    if (existeAgenda) {
      // Atualizar a agenda existente juntando os dados
      // Verificar se os novos dados da agenda são válidos
      if (
        !Array.isArray(agenda) ||
        agenda.some(
          (item) => !item.data || !Array.isArray(item.horariosDisponiveis)
        )
      ) {
        return res.status(400).send({
          message: "Dados da agenda inválidos.",
        });
      }

      // Juntar os dados existentes com os novos
      const novaAgenda = [...existeAgenda.agenda];

      agenda.forEach((novoItem) => {
        const novaData = new Date(novoItem.data);
        const index = novaAgenda.findIndex(
          (item) => new Date(item.data).getTime() === novaData.getTime()
        );
        if (index !== -1) {
          // Se a data já existir, juntar os horários disponíveis
          novoItem.horariosDisponiveis.forEach((novoHorario) => {
            const horarioIndex = novaAgenda[
              index
            ].horariosDisponiveis.findIndex(
              (horario) => horario.horario === novoHorario.horario
            );
            if (horarioIndex !== -1) {
              // Atualizar a disponibilidade do horário existente
              novaAgenda[index].horariosDisponiveis[horarioIndex].disponivel =
                novoHorario.disponivel;
            } else {
              // Adicionar o novo horário
              novaAgenda[index].horariosDisponiveis.push(novoHorario);
            }
          });
        } else {
          // Se a data não existir, adicionar o novo item
          novaAgenda.push(novoItem);
        }
      });

      existeAgenda.agenda = novaAgenda;

      try {
        await existeAgenda.save();
        res.status(200).send({
          status: "success",
          message: "Agenda atualizada com sucesso.",
          agendaId: existeAgenda.id,
        });
      } catch (saveError) {
        res.status(500).send({
          status: "error",
          message: "Erro ao salvar a agenda atualizada.",
          error: saveError.message,
        });
      }
    } else {
      // Criar uma nova agenda
      const novaAgenda = new Agenda_Especialista({
        agenda: agenda,
        funcionario: id_funcionario,
      });

      try {
        await novaAgenda.save();
        res.status(201).send({
          status: "success",
          message: "Agenda criada com sucesso.",
          agendaId: novaAgenda.id,
        });
      } catch (saveError) {
        console.error("Erro ao salvar a nova agenda:", saveError);
        res.status(500).send({
          status: "error",
          message: "Erro ao salvar a nova agenda.",
          error: saveError.message,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Erro ao criar/atualizar a agenda.",
      error: error.message,
    });
  }
};
