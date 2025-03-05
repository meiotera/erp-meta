const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const sanitize = require("./middlewares/sanitize_inputs");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { criarRespostaErro } = require("./utilities/utils");
// const csurf = require("csurf");
require("dotenv").config();
const cors = require("cors");

const app = express();

console.log("Iniciando o servidor...");

// Configurar o CORS para permitir requisições do frontend
const corsOptions = {
  origin: 'http://127.0.0.1:5173', // Substitua pelo URL do seu frontend
  credentials: true,
};
app.use(cors(corsOptions));

// Use o middleware compression
app.use(compression());

// Middleware para desativar cache
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Middlewares de segurança
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos",
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(sanitize.sanitizeInput);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "../frontend/build")));

console.log("Arquivos estáticos configurados.");

// Importação de rotas
const viewRouter = require("./routes/views_routes");
const financeiro = require("./routes/financeiro_routes");
const clientes = require("./routes/clientes_routes");
const funcionarios = require("./routes/funcionarios_routes");
const agendamentos = require("./routes/agendamento_routes");
const criarAgenda = require("./routes/agenda_especialista_routes");
const atendimentos = require("./routes/atendimento_routes");

console.log("Rotas importadas.");

// Uso das rotas
app.use("/", viewRouter);
app.use("/financeiro", financeiro);
app.use("/clientes", clientes);
app.use("/funcionarios", funcionarios);
app.use("/agenda", agendamentos);
app.use("/criar-agenda", criarAgenda);
app.use("/atendimento", atendimentos);

console.log("Rotas configuradas.");

// Ajustar a rota de erro 404
app.all("*", (req, res, next) => {
  res.status(404).send("Página não encontrada");
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  criarRespostaErro(
    res,
    err.statusCode || 500,
    err.message || "Erro interno do servidor"
  );
});

console.log("Servidor configurado corretamente.");
module.exports = app;