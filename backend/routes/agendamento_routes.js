const express = require('express');
const agendamento_controller = require('../controllers/agendamento_controller');
const { protect } = require('../middlewares/protect');

const router = express.Router();

router.post('/agendamentos', agendamento_controller.agendar_atendimento);

router.get('/minha-agenda', protect, agendamento_controller.meus_agendamentos);

router.get(
  '/agendamento/:id',
  protect,
  agendamento_controller.buscar_agendamento,
);

router.delete(
  '/agendamento/:id',
  protect,
  agendamento_controller.delete_agendamento,
);

module.exports = router;
