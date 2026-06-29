const express = require('express');
const { generateSmartSchedule } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/schedule', generateSmartSchedule);

module.exports = router;
