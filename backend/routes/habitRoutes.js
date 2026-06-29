const express = require('express');
const { getHabits, createHabit, toggleHabit, deleteHabit } = require('../controllers/habitController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);

router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:id/toggle', toggleHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
