const express = require('express');
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All task routes require authentication

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .patch(updateTask);

module.exports = router;
