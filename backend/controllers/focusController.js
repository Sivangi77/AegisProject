const FocusSession = require('../models/FocusSession');
const User = require('../models/User');

exports.getSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.user._id }).sort({ completedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch focus sessions' });
  }
};

exports.saveSession = async (req, res) => {
  try {
    const { durationMinutes, taskContext } = req.body;
    
    // Create the session
    const session = await FocusSession.create({ 
      userId: req.user._id, 
      durationMinutes, 
      taskContext 
    });

    // Update user's global productivity score (e.g. 5 points per minute focused)
    const pointsEarned = Math.floor(durationMinutes * 5);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { productivityScore: pointsEarned }
    });

    res.status(201).json({ session, pointsEarned });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save focus session' });
  }
};
