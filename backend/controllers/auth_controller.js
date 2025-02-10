const Funcionario = require("../models/Funcionarios");
const jwt = require("jsonwebtoken");
const { criarRespostaErro } = require("../utilities/utils");
// const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (funcionario, statusCode, req, res) => {
  const token = signToken(funcionario._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove a senha do output
  funcionario.password = undefined;

  return res.status(statusCode).json({
    status: statusCode,
    token,
    data: {
      funcionario,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newFuncionario = await Funcionario.create({
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      profissao: req.body.profissao,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      role: req.body.role,
    });

    await newFuncionario.save();

    res.status(201).send({
      message: "Funcionário criado com sucesso.",
      funcionarioId: newFuncionario.id,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar se os campos estão preenchidos
    if (!email || !password) {
      return criarRespostaErro(res, 400, "Email e senha são obrigatórios.");
    }

    const funcionario = await Funcionario.findOne({ email }).select(
      "+password"
    );

    if (!funcionario) {
      return criarRespostaErro(res, 404, "Email ou senha incorretos!.");
    }

    // Verificar se o usuário está bloqueado
    if (funcionario.isBlocked()) {
      return criarRespostaErro(
        res,
        429,
        "Seu usuário foi bloqueado por muitas tentativas falhas, volte mais tarde."
      );
    }

    // Verificar a senha
    const isPasswordCorrect = await funcionario.comparePassword(password);
    if (!isPasswordCorrect) {
      await funcionario.incrementLoginAttempts();
      return criarRespostaErro(res, 401, "Email ou senha incorretos!.");
    }

    // Se a senha estiver correta, resetar tentativas de senha
    await funcionario.resetLoginAttempts();

    createSendToken(funcionario, 200, req, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};
