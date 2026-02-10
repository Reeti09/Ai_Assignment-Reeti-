const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000'
);

const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // This is what generates the REFRESH TOKEN
    scope: scopes,
    prompt: 'consent' // Forces Google to show the "Allow" screen again
});

console.log('\n1. Open this link in your browser:\n', url);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('\n2. Paste the "code" from the URL after you log in: ', async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\n✅ REFRESH_TOKEN FOUND:');
        console.log(tokens.refresh_token);
        console.log('\n3. Copy this token and add it to your .env file!');
    } catch (err) {
        console.error('Error retrieving token:', err.message);
    }
    rl.close();
});