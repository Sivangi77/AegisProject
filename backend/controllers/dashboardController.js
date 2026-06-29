const Task = require('../models/Task');
const User = require('../models/User');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(userId);

    // Fetch all tasks for the user
    const tasks = await Task.find({ userId });

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter(t => 
      t.deadline && t.deadline >= today && t.deadline < tomorrow
    );

    const completedTasks = tasks.filter(t => t.status === 'done');

    // Arbitrary calculations for UI matching
    const focusHours = (completedTasks.length * 0.75).toFixed(1); // Mock 45 mins per task
    const habitsStreak = Math.floor(user.productivityScore / 10) || 1; // Mock streak logic

    const upcomingDeadlines = tasks.filter(t => 
      t.deadline && t.deadline >= tomorrow && t.status !== 'done'
    ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);

    res.status(200).json({
      user: {
        name: user.displayName || user.email.split('@')[0],
        productivityScore: user.productivityScore,
        level: user.level,
        xp: user.xp,
      },
      stats: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        todayTasksCount: todayTasks.length,
        focusHours,
        habitsStreak
      },
      todayTasks: todayTasks.slice(0, 5),
      upcomingDeadlines
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

module.exports = {
  getDashboardData
};
