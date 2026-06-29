const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, deadline, type } = req.body;
    const newGoal = await Goal.create({ userId: req.user._id, title, deadline, type });
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

exports.updateGoalProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { progress, status: progress >= 100 ? 'completed' : 'active' },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
