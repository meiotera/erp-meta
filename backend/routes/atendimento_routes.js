const express = require('express');
const atendimento_controller = require('../controllers/atendimento_controller');
const { protect, restrictTo } = require('../middlewares/protect');

const router = express.Router();

// router.use(protect, restrictTo("admin", "funcionario"));
router.post('/', protect, atendimento_controller.atendimento);
router.get(
  '/buscar-historico-cliente/:id_cliente',
  atendimento_controller.getHistoricoCliente,
);

module.exports = router;
