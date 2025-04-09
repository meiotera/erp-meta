const Agenda_Especialista = require("../models/Agenda_Especialista");

module.exports = async (req, res, funcionario, cliente, dados) => {
  try {
    // Verifica se 'dados' é um array
    if (!Array.isArray(dados)) {
      throw new TypeError("dados não é um array");
    }

    // Cria um array para armazenar as datas e horários disponíveis
    const horariosDisponiveis = [];

    console.log('dados recebidos:', dados);

    for (const { data, hora } of dados) {
      // Verifica se a data e a hora estão presentes
      if (!data || !hora) {
        console.error('Data ou hora ausente:', { data, hora });
        continue;
      }

      // Formata a data para ISO no formato MongoDB
      const dataFormatada = new Date(data);

      console.log('dataFormatada:', dataFormatada);

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

      console.log('disponivel:', disponivel);

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
    console.error('Erro ao verificar disponibilidade:', error);
    return res.status(500).json({
      type: "error",
      message: "Erro ao verificar disponibilidade: " + error.message,
    });
  }
};