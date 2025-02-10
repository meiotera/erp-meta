const mongoose = require("mongoose");
const validator = require("validator");

const AgendamentoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (value) {
            // verificar se só tem letras e espaços
            return /^[a-zA-Z\s]+$/.test(value);
          },
          message: "O nome do cliente deve conter apenas letras",
        },
      ],
      trim: true,
    },

    telefone: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            // verificar se é um número de telefone válido
            return validator.isMobilePhone(value, "pt-BR");
          },
          message: "O telefone deve ser um número válido",
        },
      ],
    },

    email: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            // verificar se é um email válido
            return validator.isEmail(value);
          },
          message: "O email deve ser válido",
        },
      ],
    },

    cpf: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            // verificar se é um CPF válido
            return validator.isTaxID(value, "pt-BR");
          },
          message: "O CPF deve ser válido",
        },
      ],
    },

    data: {
      type: Date,
      required: true,
    },

    hora: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            // verificar se é um horário válido no formato HH:mm
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
          },
          message: "O horário deve estar no formato HH:mm",
        },
      ],
    },

    funcionario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Funcionario",
      required: true,
    },

    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },

    isCadastrado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Agendamento", AgendamentoSchema);
