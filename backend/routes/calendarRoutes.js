const express = require('express');
const { getAuthUrl, oauth2Client } = require('../calendar/googleClient');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/auth-url', protect, (req, res) => {
  const url = getAuthUrl();
  res.json({ success: true, url });
});

// OAuth Callback would go here
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
