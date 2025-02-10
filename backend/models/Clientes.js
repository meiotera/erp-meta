const mongoose = require("mongoose");
const Funcionario = require("./Funcionarios");
const { max } = require("moment-timezone");

const ClienteSchema = new mongoose.Schema({
    nome: {
      type: String,
      required: true,
      maxlength: [50, "O nome do cliente deve ter no máximo 50 caracteres"],
      validate: [{
        validator: async function (value) {
          // verificar se só tem letras e espaços
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "O nome do cliente deve conter apenas letras",
      }, ],
      trim: true,
    },

    dataNascimento: {
      type: Date,
    },

    responsavel: {
      type: String,
      maxlength: [50, "O nome do responsável deve ter no máximo 50 caracteres"],
      validate: [{
        validator: function (value) {
          // verificar se só tem letras e espaços
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "O nome do responsável deve conter apenas letras",
      }, ],
      trim: true,
    },

    cpf: {
      type: String,
      unique: [true, "Este CPF já está cadastrado"],
      required: true,
      validate: [{
        validator: function (value) {
          // verificar se só tem números
          return /^[0-9]+$/.test(value);
        },
        message: "O CPF deve conter apenas números",
      }, ],
    },

    telefone: {
      type: String,
      required: true,
      maxlength: [11, "O telefone deve ter 11 dígitos"],
      validate: [{
        validator: function (value) {
          // verificar se só tem números
          return /^[0-9]+$/.test(value);
        },
        message: "O telefone deve conter apenas números",
      }, ],
    },

    email: {
      type: String,
      required: true,
      unique: [true, "Este email já está cadastrado"],
      validate: [{
        validator: function (value) {
          // verificar se é um email válido
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        },
        message: "O email deve ser válido",
      }, ],
    },

    created_at: {
      type: Date,
      default: () => Date.now(),
    },

    funcionario: {
      type: mongoose.Schema.ObjectId,
      ref: "Funcionario",
      required: true,
    },
  },

  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
  }
);

// funcao para verificar numero de telefone valido antes de salvar no bd
ClienteSchema.pre("save", function (next) {
  const telefone = this.telefone;
  if (telefone.length !== 11) {
    throw new Error("O telefone deve ter 11 dígitos");
  }
  next();
});

const Cliente = mongoose.model("Cliente", ClienteSchema);

module.exports = Cliente;