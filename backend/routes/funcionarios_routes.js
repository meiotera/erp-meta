const express = require('express');
const authController = require('../controllers/auth_controller');
const func = require('../controllers/funcionarios_controller');
const { protect, restrictTo } = require('../middlewares/protect');

const router = express.Router();

// Rota de login (não protegida)
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch(
  '/update-especialista',
  protect,
  // func.uploadUserPhoto,
  // func.resizeUserPhoto,
  func.update_especialista,
);

router.post(
  '/cadastrar-especialista',
  protect,
  restrictTo('admin'),
  func.cadastro_especialista,
);

router.get('/buscar-especialista/:id', protect, func.buscar_especialista);

router.get(
  '/listar-funcionarios',
  protect,
  restrictTo('admin'),
  func.listar_funcionarios,
);

router.patch('/:id/update-password', protect, func.update_password);

module.exports = router;
