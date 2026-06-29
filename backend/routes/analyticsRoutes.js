const express = require('express');
const { getWeeklyAnalytics } = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);

router.get('/weekly', getWeeklyAnalytics);

module.exports = router;
