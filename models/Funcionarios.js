const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FuncionarioSchema = new mongoose.Schema(
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
          message: "O nome do funcionário deve conter apenas letras",
        },
      ],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: [true, "Este email já está cadastrado"],
      lowercase: true,
      validate: [
        {
          validator: async function (value) {
            // verificar se é um email válido
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
              value
            );
          },
          message: "Insira um email válido",
        },
      ],
    },

    telefone: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (value) {
            // verificar se só tem números
            return /^[0-9]+$/.test(value);
          },
          message: "O telefone deve conter apenas números",
        },
      ],
    },

    profissao: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (value) {
            // verificar se só tem letras
            return /^[a-zA-Z\s]+$/.test(value);
          },
          message: "A profissão do funcionário deve conter apenas letras",
        },
      ],
    },

    foto: {
      type: String,
      // default: "default.jpg",
      required: false,
    },

    role: {
      type: String,
      enum: ["admin", "funcionario"],
      default: "funcionario",
    },

    password: {
      type: String,
      required: [true, "A senha é obrigatória"],
      minlength: [6, "A senha deve ter no mínimo 6 caracteres"],
      select: false,
    },

    valor_consulta: {
      type: Number,
      default: 0,
      min: [0, "O valor da consulta deve ser maior ou igual a 0"],
    },

    descricao: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "A descrição deve ter no máximo 200 caracteres"],
    },

    created_at: {
      type: Date,
      default: Date.now(),
    },

    instagram: {
      type: String,
      required: false,
      trim: true,
      validate: [
        {
          validator: async function (value) {
            // verificar se é um instagram válido
            return /^[a-zA-Z0-9._]{3,}$/.test(value);
          },
          message: "Insira um instagram válido",
        },
      ],
    },

    password_attempts: {
      type: Number,
      default: 0,
      max: [
        5,
        "Número máximo de tentativas de senha excedido, volte em 1 hora",
      ],
    },

    password_attempts_time: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FuncionarioSchema.pre("save", function (next) {
  const telefone = this.telefone;
  if (telefone.length !== 11) {
    throw new Error("O telefone deve ter 11 dígitos");
  }
  next();
});

// Adiciona uma propriedade não persistida ao esquema
FuncionarioSchema.add({
  _passwordModified: Boolean,
});

FuncionarioSchema.virtual("confirm_password")
  .get(function () {
    return this._confirm_password;
  })
  .set(function (value) {
    this._confirm_password = value;
    // Sempre que confirm_password é definido, considera que a senha foi modificada
    this._passwordModified = true;
  });

FuncionarioSchema.pre("validate", function (next) {
  // Verifica se a validação da confirmação da senha deve ser feita
  if (this._passwordModified) {
    if (!this._confirm_password) {
      this.invalidate(
        "confirm_password",
        "A confirmação de senha é obrigatória"
      );
    } else if (this.password !== this._confirm_password) {
      this.invalidate("confirm_password", "As senhas não são iguais");
    }
  }
  next();
});

FuncionarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // Limpa a flag de modificação da senha após a hash ser gerada
  this._passwordModified = false;
  next();
});

FuncionarioSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

// Método para incrementar tentativas de login falhas
FuncionarioSchema.methods.incrementLoginAttempts = async function () {
  this.password_attempts += 1;
  this.password_attempts_time = new Date();
  await this.save({ validateBeforeSave: false });
};

// Método para resetar tentativas de login
FuncionarioSchema.methods.resetLoginAttempts = async function () {
  this.password_attempts = 0;
  this.password_attempts_time = undefined;
  await this.save({ validateBeforeSave: false });
};

// Método para verificar se o usuário está bloqueado
FuncionarioSchema.methods.isBlocked = function () {
  const now = new Date().getTime();
  return (
    this.password_attempts >= 5 &&
    this.password_attempts_time &&
    new Date(this.password_attempts_time).getTime() + 3600000 > now
  );
};

const Funcionario = mongoose.model("Funcionario", FuncionarioSchema);
module.exports = Funcionario;
