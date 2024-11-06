const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const sanitize = require("./middlewares/sanitize_inputs");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { criarRespostaErro } = require("./utilities/utils");
// const helmet = require("helmet");
const csurf = require("csurf");
require("dotenv").config();

const app = express();

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
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
      ],
      frameSrc: ["'self'", "https://www.google.com"],
      connectSrc: ["'self'", "http://157.230.5.89:3000"], // Ajuste conforme necessário
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message:
//       "Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos",
//   })
// );
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(sanitize.sanitizeInput);

// Configuração do middleware CSRF
app.use(csurf({ cookie: true }));

// Middleware para adicionar o token CSRF às respostas
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Configuração do view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Importação de rotas
const viewRouter = require("./routes/views_routes");
// const auth = require("./routes/auth_routes");
const financeiro = require("./routes/financeiro_routes");
const clientes = require("./routes/clientes_routes");
const funcionarios = require("./routes/funcionarios_routes");
const agendamentos = require("./routes/agendamento_routes");
const criarAgenda = require("./routes/agenda_especialista_routes");
const atendimentos = require("./routes/atendimento_routes");

// Uso das rotas
app.use("/", viewRouter);
// app.use("/auth", auth);
app.use("/financeiro", financeiro);
app.use("/clientes", clientes);
app.use("/funcionarios", funcionarios);
app.use("/agenda", agendamentos);
app.use("/criar-agenda", criarAgenda);
app.use("/atendimento", atendimentos);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  criarRespostaErro(
    res,
    err.statusCode || 500,
    err.message || "Erro interno do servidor"
  );
});

module.exports = app;
