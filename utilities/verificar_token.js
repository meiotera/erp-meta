const jwt = require("jsonwebtoken");
const { criarRespostaErro } = require("./utils");

module.exports = async (req, res) => {
  try {
    if (!req.headers.authorization)
      return criarRespostaErro(res, 401, "Token não fornecido");

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const funcionario_id = decoded.id;
    return funcionario_id;
    // next();
  } catch (error) {
    return criarRespostaErro(res, 401, "Token inválido");
  }
};
