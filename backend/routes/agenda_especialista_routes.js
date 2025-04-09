const express = require('express');
const { protect } = require('../middlewares/protect');
const criar_agenda_controller = require('../controllers/criar_agenda_controller');

const router = express.Router();

// router.use(protect.protect, protect.restrictTo('admin', 'funcionario'));

router.post('/', protect, criar_agenda_controller.criar_agenda);

module.exports = router;
