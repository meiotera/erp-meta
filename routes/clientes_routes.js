const express = require("express");
const cliente_controller = require("../controllers/cliente_controller");
const { protect, restrictTo } = require("../middlewares/protect");

const router = express.Router();

router.delete(
  "/delete/:id",
  protect,
  restrictTo("admin"),
  cliente_controller.delete_cliente
);
router.post(
  "/cadastrar-cliente",
  protect,
  cliente_controller.cadastrar_cliente
);
router.get("/", protect, cliente_controller.listar_clientes);
router.post("/buscar-cliente", protect, cliente_controller.buscar_paciente);
router.patch("/:id", protect, cliente_controller.update_cliente);

module.exports = router;
