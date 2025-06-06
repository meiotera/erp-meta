const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const sanitize = require('./middlewares/sanitize_inputs');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { criarRespostaErro } = require('./utilities/utils');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));

app.use(compression());

app.use((req, res, next) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  );
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      'Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos',
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitize.sanitizeInput);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Importação de rotas
const viewRouter = require('./routes/views_routes');
const financeiro = require('./routes/financeiro_routes');
const clientes = require('./routes/clientes_routes');
const funcionarios = require('./routes/funcionarios_routes');
const agendamentos = require('./routes/agendamento_routes');
const criarAgenda = require('./routes/agenda_especialista_routes');
const atendimentos = require('./routes/atendimento_routes');

// Uso das rotas
app.use('/', viewRouter);
app.use('/financeiro', financeiro);
app.use('/clientes', clientes);
app.use('/funcionarios', funcionarios);
app.use('/agenda', agendamentos);
app.use('/criar-agenda', criarAgenda);
app.use('/atendimento', atendimentos);

app.all('*', (req, res, next) => {
  res.status(404).send('Página não encontrada');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  criarRespostaErro(
    res,
    err.statusCode || 500,
    err.message || 'Erro interno do servidor',
  );
});

module.exports = app;
