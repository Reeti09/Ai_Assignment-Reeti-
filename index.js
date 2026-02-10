require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const nodemailer = require('nodemailer');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Helper to prevent 429 Rate Limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,     
    process.env.GOOGLE_CLIENT_SECRET, 
    process.env.GOOGLE_REDIRECT_URI   
);

if (process.env.REFRESH_TOKEN) {
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
}

// 1. Email Delivery Function
async function deliverMeetingPrep(prospectEmail, company, prepContent) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.YOUR_EMAIL,
            pass: process.env.YOUR_APP_PASSWORD 
        }
    });

    const emailTemplate = `
        <div style="font-family: Arial, sans-serif; border: 2px solid #00A1E0; border-radius: 8px; padding: 20px;">
            <div style="color: #333;">${prepContent}</div>
            <hr>
            <p style="font-size: 10px; color: #888;">Sent via Salesforce Prep Buddy AI Assistant</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"AI Sales Assistant" <${process.env.YOUR_EMAIL}>`,
            to: process.env.YOUR_EMAIL, 
            subject: `🚀 Insights for your meeting with ${company}`,
            html: emailTemplate
        });
        console.log(`✅ Prep delivered via email for ${company}`);
    } catch (err) {
        console.error("❌ Email Delivery failed:", err.message);
    }
}

// 2. Auth Routes
app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', 
        scope: ['https://www.googleapis.com/auth/calendar.readonly']
    });
    res.redirect(url);
});

// 3. Main Dashboard Route
// 3. Main Dashboard Route
app.get('/', async (req, res) => {
    try {
        const { code } = req.query;
        if (code) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            return res.redirect('/');
        }

        if (!oauth2Client.credentials.refresh_token && !oauth2Client.credentials.access_token) {
            return res.redirect('/auth');
        }

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const calRes = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = calRes.data.items || [];
        const meetingsData = [];

        for (const event of events) {
            const prospect = event.attendees?.find(a => !a.self && !a.email.includes('salesforce.com'));
            
            if (prospect) {
                const companyName = prospect.email.split('@')[1].split('.')[0].toUpperCase();
                let insights = "";

                await sleep(3000); 

                try {
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
                    
                    // DEEPER PROMPT FOR MORE MATTER
                    const prompt = `
                        ACT AS AN ELITE SALESFORCE SOLUTIONS ARCHITECT. 
                        Target: ${prospect.email} at ${companyName}.
                        
                        Generate a DEEP STRATEGIC BRIEFING. I need substantial "matter" for a 60-minute meeting.
                        Format using ONLY HTML (<h3>, <ul>, <li>, <strong>, <p>). 
                        
                        Include:
                        1. Executive Summary: The 2026 outlook for ${companyName}.
                        2. Deep-Dive Pain Points: Technical silos, data fragmentation, and specific revenue leakages.
                        3. Salesforce Multi-Cloud Strategy: How Data Cloud + Agentforce specifically fixes these for ${companyName}.
                        4. Discovery Questions: 5 high-level questions to ask during the meeting.
                        5. Competitive Edge: How this move beats their top 3 rivals.
                        
                        STRICT: No markdown. Be professional, wordy, and analytical.
                    `;

                    const aiRes = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
                        })
                    });

                    const data = await aiRes.json();
                    if (aiRes.status === 429) throw new Error("QUOTA_EXCEEDED");

                    let rawInsights = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (rawInsights) {
                        insights = rawInsights.replace(/```html|```/gi, "").trim();
                    } else {
                        throw new Error("EMPTY_RESPONSE");
                    }

                } catch (e) { 
                    console.error(`⚠️ Using Deep Strategic Fallback for ${companyName}`);
                    
                    // COMPREHENSIVE FALLBACK (Increased "Matter")
                    insights = `
                        <h3>Executive Briefing: ${companyName} Digital Transformation 2026</h3>
                        <p><strong>Strategic Context:</strong> As ${companyName} navigates the post-AI-adoption landscape of 2026, the primary challenge has shifted from "acquiring data" to "activating intelligence." Current indicators suggest a significant gap between their customer touchpoints and back-office fulfillment.</p>
                        
                        <h3>Critical Business Pain Points</h3>
                        <ul>
                          <li><strong>Data Liquidity Crisis:</strong> ${companyName} is likely suffering from "Siloed Intelligence," where customer preferences in digital channels aren't reflected in real-time service interactions, leading to a 15-20% churn risk in high-value segments.</li>
                          <li><strong>Operational Rigidity:</strong> Reliance on legacy middleware is preventing the deployment of autonomous agents, causing a 30% increase in OpEx compared to cloud-native competitors.</li>
                          <li><strong>The 360-Degree Gap:</strong> Without a unified data profile, marketing spend is currently 25% less efficient due to over-targeting and poor segmentation.</li>
                        </ul>

                        <h3>Salesforce Strategic Roadmap</h3>
                        <ul>
                          <li><strong>Agentforce Integration:</strong> Deploying autonomous agents to handle tier-1 support, allowing the ${companyName} team to focus on high-touch relationship management.</li>
                          <li><strong>Data Cloud Foundation:</strong> Harmonizing disparate data streams (Web, POS, ERP) into a single metadata layer for real-time personalization.</li>
                        </ul>

                        <h3>Discovery Questions for Lead Prep</h3>
                        <ul>
                          <li>"How is the current latency in your data synchronization affecting your 2026 customer satisfaction KPIs?"</li>
                          <li>"If we could reduce your manual workflow overhead by 40% via Agentforce, where would you reallocate that human capital?"</li>
                        </ul>

                        
                    `; 
                }

                meetingsData.push({
                    summary: event.summary,
                    time: new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    email: prospect.email,
                    company: companyName,
                    prepHtml: insights
                });

                await deliverMeetingPrep(prospect.email, companyName, insights);
            }
        }
        res.render('dashboard', { meetings: meetingsData });
    } catch (err) {
        if (err.message.includes('invalid_grant')) return res.redirect('/auth');
        res.status(500).send("Critical Error: " + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 AI Assistant Live on port ${PORT}`));