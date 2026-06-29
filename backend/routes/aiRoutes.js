const express = require('express');
const { generateSmartSchedule } = require('../controllers/aiController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);



router.get('/schedule', generateSmartSchedule);

module.exports = router;
