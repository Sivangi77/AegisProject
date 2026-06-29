const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ deadline: 1, priorityScore: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;
    
    // AI Integration hook: Evaluate priorityScore dynamically here or later
    
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update task status/details
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure user owns task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
