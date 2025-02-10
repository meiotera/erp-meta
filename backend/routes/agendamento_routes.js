const express = require("express");
const agendamento_controller = require("../controllers/agendamento_controller");
const { protect } = require("../middlewares/protect");

const router = express.Router();

router.post("/agendamentos", agendamento_controller.agendar_atendimento);

// router.use(protect.protect, protect.restrictTo("admin", "funcionario"));
router.get("/minha-agenda", protect, agendamento_controller.meus_agendamentos);

module.exports = router;
