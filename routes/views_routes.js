const express = require("express");
const viewsController = require("../controllers/views_controller");
const clientesController = require("../controllers/cliente_controller");
const { protect, restrictTo } = require("../middlewares/protect");

const router = express.Router();

// Rotas Públicas
router.get("/", viewsController.getHome); // Página principal
router.get("/login", viewsController.getLogin); // Página de login
router.get("/agendamento", viewsController.getAgendamento); // Página de agendamento
router.get("/especialista/:id/dias-horarios", viewsController.getHorariosDatas); // Dias e horários do especialista

// Rotas Protegidas
// router.use(protect);
router.get("/financeiro", protect, viewsController.getFinanceiro); // Página de financeiro

router.get("/agenda", protect, viewsController.getAgenda); // Página do dashboard (agenda)
router
  .route("/cadastrar-cliente")
  .get(protect, viewsController.getCadastroCliente) // Página de cadastro de cliente
  .post(protect, clientesController.cadastrar_cliente); // Cadastro de cliente

router.get(
  "/meus-atendimentos",
  protect,
  viewsController.meusAtendimentosRealizados
); // Atendimentos realizados
router.get(
  "/historico-cliente/:id_cliente",
  protect,
  viewsController.renderHistoricoCliente
); // Histórico do cliente
router.get("/meus-pacientes", protect, viewsController.meusPacientes); // Meus pacientes
router.get("/meu-perfil", protect, viewsController.getMeuPerfil); // Meu perfil

// Rotas Restritas a Administradores
router.get(
  "/cadastrar-especialista",
  protect,
  restrictTo("admin"),
  viewsController.getCadastrarEspecialista
); // Cadastro de especialista

module.exports = router;
