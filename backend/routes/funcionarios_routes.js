const express = require('express');
const authController = require('../controllers/auth_controller');
const func = require('../controllers/funcionarios_controller');
const { protect, restrictTo } = require('../middlewares/protect');
// const uploadFoto = require("../middlewares/uploadFotoPerfil");

const router = express.Router();

// Rota de login (não protegida)
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rotas protegidas
// router.use(protect);

router.patch(
  '/update-especialista',
  protect,
  func.uploadUserPhoto,
  func.resizeUserPhoto,
  func.update_especialista,
);

// Rotas protegidas e restritas a administradores
// router.use(restrictTo("admin"));

router.post(
  '/cadastrar-especialista',
  protect,
  restrictTo('admin'),
  func.cadastro_especialista,
);
router.get(
  '/listar-funcionarios',
  protect,
  restrictTo('admin'),
  func.listar_funcionarios,
);

module.exports = router;
