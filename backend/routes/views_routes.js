const express = require('express');
const viewsController = require('../controllers/views_controller');
const clientesController = require('../controllers/cliente_controller');
const { protect, restrictTo } = require('../middlewares/protect');

const router = express.Router();

// Rotas Públicas
router.get('/', viewsController.getHome);
router.get('/login', viewsController.getLogin);
router.get('/agendamento', viewsController.getAgendamento);
router.get('/especialista/:id/dias-horarios', viewsController.getHorariosDatas);

// Rotas Protegidas
router.get('/financeiro', protect, viewsController.getFinanceiro);

router.get('/agenda', protect, viewsController.getAgenda);
router
  .route('/cadastrar-cliente')
  .get(protect, viewsController.getCadastroCliente)
  .post(protect, clientesController.cadastrar_cliente);

router.get(
  '/meus-atendimentos',
  protect,
  viewsController.meusAtendimentosRealizados,
);
router.get(
  '/historico-cliente/:id_cliente',
  protect,
  viewsController.renderHistoricoCliente,
);
router.get('/meus-pacientes', protect, viewsController.meusPacientes);
router.get('/meu-perfil', protect, viewsController.getMeuPerfil);
router.get(
  '/cadastrar-especialista',
  protect,
  restrictTo('admin'),
  viewsController.getCadastrarEspecialista,
);

module.exports = router;
