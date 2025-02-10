// const mongoose = require("mongoose");

// const AgendaEspecialistaSchema = new mongoose.Schema({
//   // Datas disponibilizadas pelo especialista para atendimentos
//   agenda: [
//     {
//       data: {
//         type: Date,
//         required: [true, "Informe uma data para criar sua agenda."],
//       },
//       horariosDisponiveis: [
//         {
//           horario: {
//             type: String,
//             required: [
//               true,
//               "Informe os horários disponíveis para atendimento.",
//             ],
//           },
//           disponivel: {
//             type: Boolean,
//             default: true,
//           },
//         },
//       ],
//     },
//   ],

//   funcionario: {
//     type: mongoose.Schema.ObjectId,
//     ref: "Funcionario",
//     required: [true, "Selecione um dos nossos especialistas."],
//   },
// });

// const Agenda_Especialista = mongoose.model(
//   "Agenda_Especialista",
//   AgendaEspecialistaSchema
// );
// module.exports = Agenda_Especialista;

const mongoose = require("mongoose");

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

// Middleware para verificar se a data já passou antes de salvar
AgendaEspecialistaSchema.pre("save", function (next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Validar se as datas da agenda não são passadas
  this.agenda.forEach((entry) => {
    const entryDate = new Date(
      entry.data.getFullYear(),
      entry.data.getMonth(),
      entry.data.getDate()
    );

    if (entryDate >= today) {
      return next();
    }
  });
});

// Middleware para verificar se a data já passou antes de atualizar
AgendaEspecialistaSchema.pre("findOneAndUpdate", function (next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const update = this.getUpdate();

  if (update.$set && update.$set.agenda) {
    update.$set.agenda.forEach((entry) => {
      const entryDate = new Date(
        entry.data.getFullYear(),
        entry.data.getMonth(),
        entry.data.getDate()
      );

      if (entryDate < today) {
        return next(
          new Error(
            `Não é possível adicionar datas passadas. Data inválida: ${entryDate.toISOString()}`
          )
        );
      }
    });
  }

  next();
});

// Middleware para marcar horários como indisponíveis se a data já passou
AgendaEspecialistaSchema.pre("save", function (next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  this.agenda.forEach((entry) => {
    const entryDate = new Date(
      entry.data.getFullYear(),
      entry.data.getMonth(),
      entry.data.getDate()
    );

    if (entryDate < today) {
      entry.horariosDisponiveis.forEach((horario) => {
        horario.disponivel = false;
      });
    }
  });

  next();
});

AgendaEspecialistaSchema.pre("findOneAndUpdate", function (next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const update = this.getUpdate();

  if (update.$set && update.$set.agenda) {
    update.$set.agenda.forEach((entry) => {
      const entryDate = new Date(
        entry.data.getFullYear(),
        entry.data.getMonth(),
        entry.data.getDate()
      );

      if (entryDate < today) {
        entry.horariosDisponiveis.forEach((horario) => {
          horario.disponivel = false;
        });
      }
    });
  }

  next();
});

const Agenda_Especialista = mongoose.model(
  "Agenda_Especialista",
  AgendaEspecialistaSchema
);

module.exports = Agenda_Especialista;
