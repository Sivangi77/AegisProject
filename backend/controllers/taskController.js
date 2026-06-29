const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks for user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tasks', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, estimatedTimeMinutes, deadline } = req.body;
    
    const newTask = new Task({
      userId: req.user._id,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      estimatedTimeMinutes: estimatedTimeMinutes || 30,
      deadline
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find task to check if it belongs to user
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const wasCompleted = task.status === 'done';
    const isNowCompleted = req.body.status === 'done';

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    // Handle productivity score update if status changed to done
    if (!wasCompleted && isNowCompleted) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { productivityScore: 10, xp: 50 } // Arbitrary score bump
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
