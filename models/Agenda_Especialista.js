const mongoose = require("mongoose");
const Funcionario = require("./Funcionarios");

const AgendaEspecialistaSchema = new mongoose.Schema({
  // Datas disponibilizadas pelo especialista para atendimentos
  agenda: [
    {
      data: {
        type: Date,
        required: [true, "Informe uma data para criar sua agenda."],
      },
      horariosDisponiveis: [
        {
          horario: {
            type: String,
            required: [
              true,
              "Informe os horários disponíveis para atendimento.",
            ],
          },
          disponivel: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
  ],

  funcionario: {
    type: mongoose.Schema.ObjectId,
    ref: "Funcionario",
    required: [true, "Selecione um dos nossos especialistas."],
  },
});

const Agenda_Especialista = mongoose.model(
  "Agenda_Especialista",
  AgendaEspecialistaSchema
);
module.exports = Agenda_Especialista;
