const { getGeminiResponse } = require('../ai/geminiClient');
const Task = require('../models/Task');

// @desc    Get smart scheduling suggestions
// @route   GET /api/ai/schedule
// @access  Private
exports.generateSmartSchedule = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: { $ne: 'done' } });
    
    if (tasks.length === 0) {
      return res.status(200).json({ success: true, data: "You have no pending tasks. Enjoy your day!" });
    }

    const taskListString = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedTimeMinutes} mins)`).join('\n');
    
    const systemPrompt = `You are an elite productivity chief of staff. 
Your goal is to optimize the user's schedule to prevent burnout and ensure deadlines are met.
Suggest an optimal order for their tasks and provide a brief motivating paragraph.`;

    const userPrompt = `Here are my pending tasks:\n${taskListString}\n\nPlease generate an optimized daily plan for me.`;

    const aiResponse = await getGeminiResponse(userPrompt, systemPrompt);

    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI generation failed' });
  }
};
