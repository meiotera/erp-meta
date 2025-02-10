const Agenda_Especialista = require("../models/Agenda_Especialista");

module.exports = async (req, res, funcionario, cliente, dados) => {
  try {
    // Cria um array para armazenar as datas e horários disponíveis
    const horariosDisponiveis = [];

    for (const { data, hora } of dados) {
      // Formata a data para ISO no formato MongoDB
      const dataFormatada = new Date(data.split("/").reverse().join("-"));

      // Encontra as datas e horários disponíveis
      const disponivel = await Agenda_Especialista.findOne({
        funcionario,
        agenda: {
          $elemMatch: {
            data: dataFormatada,
            horariosDisponiveis: {
              $elemMatch: { horario: hora, disponivel: true },
            },
          },
        },
      });

      // Se encontrar a data e o horário disponível, adiciona ao array de resultados
      if (disponivel) {
        horariosDisponiveis.push({ data, hora });
      }
    }

    // Retorna apenas os horários disponíveis
    return {
      type: "success",
      message: "Horários disponíveis para agendamento.",
      horariosDisponiveis,
    };
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Erro ao verificar disponibilidade: " + error.message,
    });
  }
};
