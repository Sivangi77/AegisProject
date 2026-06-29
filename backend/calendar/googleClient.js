const { google } = require('googleapis');

// Note: Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// We would generate an auth url and get a token
const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/tasks'
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

const getCalendarEvents = async (tokens) => {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return response.data.items;
};

module.exports = { getAuthUrl, getCalendarEvents, oauth2Client };
