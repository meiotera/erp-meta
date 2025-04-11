const express = require('express');
const financeiro_controller = require('../controllers/financeiro_controller');
const { protect } = require('../middlewares/protect');

const router = express.Router();

router.post('/', protect, financeiro_controller.financeiro);

module.exports = router;
