const mongoose = require("mongoose");
const Funcionario = require("./Funcionarios");
const Cliente = require("./Clientes");
const validator = require("validator");

const AtendimentoSchema = new mongoose.Schema({
  objetivo: {
    type: String,
    trim: true,
    minlength: [5, "Número mínimo de caracteres 10 não atingido."],
    maxlength: [2000, "Número máximo de caracteres 2000 excedido."],
    set: (value) => validator.escape(value),
  },

  recursos: {
    type: String,
    trim: true,
    minlength: [5, "Número mínimo de caracteres 10 não atingido."],
    maxlength: [2000, "Número máximo de caracteres 2000 excedido."],
    set: (value) => validator.escape(value),
  },

  observacao: {
    type: String,
    trim: true,
    minlength: [5, "Número mínimo de caracteres 10 não atingido."],
    maxlength: [2000, "Número máximo de caracteres 2000 excedido."],
    set: (value) => validator.escape(value),
  },

  encaminhamento: {
    type: String,
    trim: true,
    minlength: [5, "Número mínimo de caracteres 10 não atingido."],
    maxlength: [2000, "A reclamação não pode exceder 2000 caracteres"],
    set: (value) => validator.escape(value),
  },

  medicacao: {
    type: String,
    trim: true,
    minlength: [5, "Número mínimo de caracteres 10 não atingido."],
    maxlength: [2000, "A reclamação não pode exceder 2000 caracteres"],
    set: (value) => validator.escape(value),
  },

  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: "Cliente",
    required: true,
  },

  funcionario: {
    type: mongoose.Schema.ObjectId,
    ref: "Funcionario",
    required: true,
  },

  agendamento: {
    type: mongoose.Schema.ObjectId,
    ref: "Agendamento",
    required: true,
  },

  valor: {
    type: Number,
    required: [true, "O valor do atendimento é obrigatório."],
  },

  create_at: {
    type: Date,
    default: () => Date.now(),
  },

  realizado: {
    type: Boolean,
    default: false,
  },

  updated_at: {
    type: Date,
  },

  updated_by: {
    type: mongoose.Schema.ObjectId,
    ref: "Funcionario",
  },
});

AtendimentoSchema.pre("save", function (next) {
  this.updated_at = Date.now();

  this.updated_by = this._updated_by;
  next();
});

const Atendimento = mongoose.model("Atendimento", AtendimentoSchema);
module.exports = Atendimento;
