const express = require('express');
const { getSessions, saveSession } = require('../controllers/focusController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);

router.get('/', getSessions);
router.post('/session', saveSession);

module.exports = router;
