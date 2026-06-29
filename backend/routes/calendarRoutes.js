const express = require('express');
const { getAuthUrl, oauth2Client } = require('../calendar/googleClient');
const { requireAuth } = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/calendarController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Event CRUD Routes
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Google Calendar OAuth Routes (Placeholders)
router.get('/auth-url', (req, res) => {
  const url = getAuthUrl();
  res.json({ success: true, url });
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        // Save tokens to user model in database
        res.status(200).json({ success: true, message: 'Google accounts synced' });
    } catch(err) {
        res.status(400).json({ success: false, error: 'Failed to authenticate with Google' });
    }
});

module.exports = router;
