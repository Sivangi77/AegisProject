const { google } = require('googleapis');

// Note: Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI are set in .env
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/calendar/callback'
);

const getAuthUrl = (userId) => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    state: userId,
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  });
};

const syncEventToGoogle = async (userId, eventDetails) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || !user.googleCalendarTokens) return null;

    oauth2Client.setCredentials(user.googleCalendarTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description || 'Created via AEGIS',
      start: {
        dateTime: new Date(eventDetails.date || eventDetails.deadline).toISOString(),
      },
      end: {
        // Just add 1 hour if no end time
        dateTime: new Date(new Date(eventDetails.date || eventDetails.deadline).getTime() + 60 * 60 * 1000).toISOString(),
      }
    };

    if (eventDetails.googleEventId) {
      const res = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventDetails.googleEventId,
        resource: event,
      });
      return res.data;
    } else {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      return res.data;
    }
  } catch (error) {
    console.error('Google Calendar Sync Error:', error);
    return null;
  }
};

const deleteEventFromGoogle = async (userId, googleEventId) => {
  try {
    if (!googleEventId) return;
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || !user.googleCalendarTokens) return;

    oauth2Client.setCredentials(user.googleCalendarTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });
  } catch (error) {
    console.error('Google Calendar Delete Error:', error);
  }
};

module.exports = { oauth2Client, getAuthUrl, syncEventToGoogle, deleteEventFromGoogle };
