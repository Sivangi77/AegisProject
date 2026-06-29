const { getGeminiResponse, streamGeminiResponse } = require('../ai/geminiClient');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const FocusSession = require('../models/FocusSession');

exports.generateSmartSchedule = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, status: { $ne: 'done' } });
    if (tasks.length === 0) return res.status(200).json({ success: true, data: "You have no pending tasks. Enjoy your day!" });

    const taskListString = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedTimeMinutes} mins, Due: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'None'})`).join('\n');
    
    // Get today's events to schedule around
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const events = await Event.find({ 
      userId: req.user._id, 
      date: { $gte: today, $lt: tomorrow } 
    });
    
    const eventContext = events.length > 0 
      ? events.map(e => `- ${e.title} at ${e.startTime || 'All day'}`).join('\n') 
      : 'No events scheduled for today.';

    const systemPrompt = `You are an elite productivity chief of staff. 
    The user wants a smart schedule for today.
    
    PENDING TASKS:
    ${taskListString}
    
    TODAY'S EVENTS:
    ${eventContext}
    
    Based on priority, estimated time, and existing events, suggest an optimal, highly structured schedule (hour-by-hour). Do not use markdown backticks around the response, just return clean text.`;

    const aiResponse = await getGeminiResponse(systemPrompt, systemPrompt); // passing prompt as content and instruction
    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('generateSmartSchedule Error:', error);
    res.status(500).json({ success: false, error: error.message || 'AI generation failed' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const convo = await Conversation.findOne({ userId: req.user._id });
    if (!convo) {
      return res.status(200).json([]);
    }
    res.status(200).json(convo.messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // 1. Concurrently Fetch ALL User Context
    const [tasks, events, user, goals, habits, sessions] = await Promise.all([
      Task.find({ userId: req.user._id, status: { $ne: 'done' } }),
      Event.find({ userId: req.user._id, date: { $gte: new Date() } }).sort({ date: 1 }).limit(10),
      User.findById(req.user._id),
      Goal.find({ userId: req.user._id, status: 'active' }),
      Habit.find({ userId: req.user._id }),
      FocusSession.find({ userId: req.user._id }).sort({ completedAt: -1 }).limit(5)
    ]);

    const taskContext = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedTimeMinutes}m, Due: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'None'})`).join('\n');
    const eventContext = events.map(e => `- ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.startTime || 'All day'}`).join('\n');
    const goalContext = goals.map(g => `- ${g.title} (Type: ${g.type}, Progress: ${g.progress}%, Deadline: ${new Date(g.deadline).toLocaleDateString()})`).join('\n');
    const habitContext = habits.map(h => `- ${h.title} (Current Streak: ${h.streak} days)`).join('\n');
    const focusContext = sessions.map(s => `- ${s.durationMinutes} mins on ${new Date(s.completedAt).toLocaleDateString()}`).join('\n');

    const systemInstruction = `You are AEGIS, an elite AI Productivity Chief of Staff.
Your personality is professional, highly analytical, motivating, and proactive.
Do NOT give generic advice. Use the user's specific context to formulate your answers. If they ask to prioritize, use their task priorities, goal deadlines, and habit streaks.
You MUST consider their entire context. For example, if they ask what to do, look at pending urgent tasks and active goals with low progress.

USER CONTEXT:
Name: ${user.displayName || user.email}
Productivity Score: ${user.productivityScore} (Level ${user.level})

PENDING TASKS:
${taskContext || 'None'}

UPCOMING EVENTS:
${eventContext || 'None'}

ACTIVE GOALS:
${goalContext || 'None'}

HABITS:
${habitContext || 'None'}

RECENT FOCUS SESSIONS:
${focusContext || 'None'}

Always format your responses cleanly with proper markdown.`;

    // 2. Fetch Conversation History
    let convo = await Conversation.findOne({ userId: req.user._id });
    if (!convo) {
      convo = new Conversation({ userId: req.user._id, messages: [] });
    }

    const history = convo.messages.map(m => ({ role: m.role, text: m.text }));

    // 3. Initiate Streaming Response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const resultStream = await streamGeminiResponse(history, message, systemInstruction);

    let fullAiText = '';

    for await (const chunk of resultStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullAiText += chunkText;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

    // 4. Save Conversation
    convo.messages.push({ role: 'user', text: message });
    convo.messages.push({ role: 'model', text: fullAiText });
    await convo.save();

  } catch (error) {
    console.error('AI Chat Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to chat with AI' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      res.end();
    }
  }
};
