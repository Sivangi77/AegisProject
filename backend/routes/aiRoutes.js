const express = require('express');
const { generateSmartSchedule, chatWithAI, getChatHistory } = require('../controllers/aiController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);

router.get('/schedule', generateSmartSchedule);
router.get('/history', getChatHistory);
router.post('/chat', chatWithAI);

module.exports = router;
