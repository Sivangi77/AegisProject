const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');
const Habit = require('../models/Habit');
const { startOfDay, subDays, isSameDay } = require('date-fns');

exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = startOfDay(new Date());
    
    // Generate array of last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
    
    // 1. Fetch completed tasks for last 7 days
    const tasks = await Task.find({
      userId,
      status: 'done',
      updatedAt: { $gte: subDays(today, 6) }
    });

    // 2. Fetch focus sessions for last 7 days
    const sessions = await FocusSession.find({
      userId,
      completedAt: { $gte: subDays(today, 6) }
    });

    // Aggregate by day
    const chartData = last7Days.map(date => {
      const dayTasks = tasks.filter(t => isSameDay(new Date(t.updatedAt), date)).length;
      
      const daySessions = sessions.filter(s => isSameDay(new Date(s.completedAt), date));
      const dayFocusMinutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      const dayFocusHours = Number((dayFocusMinutes / 60).toFixed(1)); // e.g., 2.5 hours
      
      return {
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        date: date.toISOString(),
        tasks: dayTasks,
        focus: dayFocusHours
      };
    });

    res.status(200).json({ chartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
