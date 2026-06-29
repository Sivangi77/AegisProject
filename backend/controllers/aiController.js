const { getGeminiResponse, streamGeminiResponse } = require('../ai/geminiClient');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

exports.generateSmartSchedule = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: { $ne: 'done' } });
    if (tasks.length === 0) return res.status(200).json({ success: true, data: "You have no pending tasks. Enjoy your day!" });

    const taskListString = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedTimeMinutes} mins)`).join('\n');
    const systemPrompt = `You are an elite productivity chief of staff.\nSuggest an optimal order for these tasks: ${taskListString}`;

    const aiResponse = await getGeminiResponse("Generate my schedule", systemPrompt);
    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI generation failed' });
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

    // 1. Fetch User Context
    const tasks = await Task.find({ userId: req.user._id, status: { $ne: 'done' } });
    const events = await Event.find({ userId: req.user._id, date: { $gte: new Date() } }).sort({ date: 1 }).limit(5);
    const user = await User.findById(req.user._id);

    const taskContext = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedTimeMinutes}m, Due: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'None'})`).join('\n');
    const eventContext = events.map(e => `- ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.startTime || 'All day'}`).join('\n');

    const systemInstruction = `You are AEGIS, an elite AI Productivity Chief of Staff.
Your personality is professional, highly analytical, motivating, and proactive.
Do NOT give generic advice. Use the user's specific context to formulate your answers. If they ask about their day, list their specific tasks and events. If they ask to prioritize, use their task priorities and estimated times.

USER CONTEXT:
Name: ${user.displayName || user.email}
Productivity Score: ${user.productivityScore} (Level ${user.level})
Pending Tasks:
${taskContext || 'None'}
Upcoming Events/Deadlines:
${eventContext || 'None'}

Always format your responses cleanly. Be direct.`;

    // 2. Fetch Conversation History
    let convo = await Conversation.findOne({ userId: req.user._id });
    if (!convo) {
      convo = new Conversation({ userId: req.user._id, messages: [] });
    }

    const history = convo.messages.map(m => ({ role: m.role, text: m.text }));

    // 3. Initiate Streaming Response
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Start stream
    const resultStream = await streamGeminiResponse(history, message, systemInstruction);

    let fullAiText = '';

    for await (const chunk of resultStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullAiText += chunkText;
        // Write the chunk to the client using SSE format
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    // End the SSE stream
    res.write('data: [DONE]\n\n');
    res.end();

    // 4. Save Conversation to MongoDB
    convo.messages.push({ role: 'user', text: message });
    convo.messages.push({ role: 'model', text: fullAiText });
    await convo.save();

  } catch (error) {
    console.error('AI Chat Error:', error);
    // If headers haven't been sent, send 500. Otherwise just end.
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to chat with AI' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      res.end();
    }
  }
};
