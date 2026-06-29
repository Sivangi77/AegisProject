const express = require('express');
const { getAuthUrl, oauth2Client } = require('../calendar/googleClient');
const { requireAuth } = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/calendarController');

const router = express.Router();

// Callback from Google (MUST be unprotected because Google hits it without Bearer token)
router.get('/callback', async (req, res) => {
    const { code, state } = req.query; // state contains userId
    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        if (state) {
          const User = require('../models/User');
          await User.findByIdAndUpdate(state, { googleCalendarTokens: tokens });
        }
        
        // Redirect back to frontend
        res.redirect('http://localhost:5173/dashboard?google_calendar_connected=true');
    } catch(err) {
        console.error('OAuth Callback Error:', err);
        res.redirect('http://localhost:5173/dashboard?google_calendar_connected=false');
    }
});

// Apply auth middleware to all routes below this point
router.use(requireAuth);

// Event CRUD Routes
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Generate OAuth Consent URL
router.get('/auth-url', (req, res) => {
  const url = getAuthUrl(req.user._id.toString());
  res.json({ success: true, url });
});

module.exports = router;
