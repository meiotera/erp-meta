const mongoose = require("mongoose");

const ServicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: [true, "Este serviço já existe"],
    validate: [
      {
        validator: async function (value) {
          // verificar se só tem letras
          return /^[a-zA-Z]+$/.test(value);
        },
        message: "O nome do serviço deve conter apenas letras",
      },
    ],
    trim: true,
  },

  description: {
    type: String,
    validate: [
      {
        validator: function (value) {
          return value.length <= 100;
        },
        message: "A descrição deve ter no máximo 100 caracteres",
      },
    ],
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: [0, "Insira um valor válido"],
    default: 0,
  },

  price_discount: {
    type: Number,
    min: [0, "Insira um valor válido"],
    default: 0,
    validate: [
      {
        validator: function (value) {
          return value < this.price;
        },
        message: "O desconto não pode ser maior que o preço original!",
      },
    ],
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Servico = mongoose.model("Servico", ServicoSchema);

module.exports = Servico;
