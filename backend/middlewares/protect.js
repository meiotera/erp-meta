const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Funcionarios = require("../models/Funcionarios");

exports.protect = async function (req, res, next) {

  try {
    let token;

    // Verifica se o token está no cabeçalho Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // Se não houver token, retorna erro de não autorizado
    if (!token) {
      return res.status(401).json({
        message: "Você não está logado! Por favor, faça o login para acessar.",
      });
    }
    

    // Verifica o token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Verifica se o funcionário ainda existe
    const currentFuncionario = await Funcionarios.findById(decoded.id);
    if (!currentFuncionario) {
      return res.status(401).send({
        message: "O funcionário que pertence a este token não existe mais.",
      });
    }

    // Concede acesso ao funcionário
    req.funcionario = currentFuncionario;
    res.locals.funcionario = currentFuncionario;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Falha na autenticação.",
    });
  }
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!req.funcionario || !roles.includes(req.funcionario.role)) {
      return res.status(403).send({
        message: "Você não tem permissão para realizar esta ação.",
      });
    }
    next();
  };
};
