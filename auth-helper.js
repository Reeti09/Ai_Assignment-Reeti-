const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback'
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Critical for refresh token
  scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  prompt: 'consent'
});

console.log('\n1. Open this URL in your browser:\n', url);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('\n2. Paste the code from the redirect URL here: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('\n✅ REFRESH TOKEN:', tokens.refresh_token);
  console.log('Copy this into your .env file as REFRESH_TOKEN=your_token_here');
  rl.close();
});