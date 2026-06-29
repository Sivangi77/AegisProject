const Habit = require('../models/Habit');
const { startOfDay, isSameDay, subDays } = require('date-fns');

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { title } = req.body;
    const newHabit = await Habit.create({ userId: req.user._id, title, history: [] });
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

exports.toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = startOfDay(new Date());
    
    // Check if already completed today
    const completedTodayIdx = habit.history.findIndex(date => isSameDay(new Date(date), today));
    
    if (completedTodayIdx !== -1) {
      // Un-toggle (remove today's date)
      habit.history.splice(completedTodayIdx, 1);
    } else {
      // Toggle (add today's date)
      habit.history.push(today);
    }
    
    // Recalculate streak
    // Sort history descending
    const sortedHistory = [...habit.history].sort((a, b) => b - a);
    let currentStreak = 0;
    let checkDate = today;

    if (sortedHistory.length > 0 && (isSameDay(sortedHistory[0], today) || isSameDay(sortedHistory[0], subDays(today, 1)))) {
       for (let i = 0; i < sortedHistory.length; i++) {
          if (isSameDay(sortedHistory[i], checkDate)) {
             currentStreak++;
             checkDate = subDays(checkDate, 1);
          } else {
             break;
          }
       }
    }

    habit.streak = currentStreak;
    await habit.save();
    
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};
