# 🤖 Salesforce Prep Buddy: Omni-Channel AI Assistant

**Salesforce Prep Buddy** is an intelligent meeting preparation engine designed for high-performance sales teams. It synchronizes with a user's Google Calendar to generate deep, strategic briefings for upcoming meetings, delivering them across multiple channels to ensure a representative is prepared anywhere, anytime.

---
## 🚀 Live Demo
**[View Live Application](https://ai-assignment-reeti.onrender.com)**

## Live Demo Video

https://github.com/user-attachments/assets/13747254-1618-4053-bb57-70794c749c38



## 🌟 Expectations Met & Exceeded

The challenge required a creative assistant that syncs with a calendar and provides meeting prep. This solution exceeds those requirements by offering a full **Omni-Channel experience**:

### 1. **Creative Delivery Channels**
* **Strategic Web Dashboard:** A high-fidelity UI built with Tailwind CSS for deep-dive morning planning.
* **Automated Email Sync:** Briefings are pushed to the user's Gmail inbox for mobile access and "just-in-time" prep.
* **Professional PDF Export:** A clean, print-ready document engine for offline review or client leave-behinds.
* **Voice-Enabled Briefing:** Built-in **Text-to-Speech (TTS)** functionality allowing reps to listen to their strategy while commuting.
* **Slack Integration (Simulated):** A "Push to Slack" feature demonstrating cross-platform ecosystem thinking.

### 2. **Technical Resilience & "Matter"**
* **Deep Strategic Analysis:** The AI acts as an Elite Salesforce Architect, focusing on **Data Cloud**, **Agentforce**, and **ROI Pressure** rather than basic summaries.
* **Graceful Degradation:** Implemented a **Strategic Fallback System**. If the AI API hits a rate limit (429), the app automatically generates a high-quality fallback briefing so the user is never left without data.
* **Rate-Limit Shield:** Integrated a custom `sleep()` utility to respect Google and Gemini API quotas.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express
* **AI Engine:** Google Gemini 1.5 Flash
* **APIs:** Google Calendar API (v3), Google OAuth 2.0
* **Frontend:** EJS, Tailwind CSS (Typography Plugin), Web Speech API
* **Delivery:** Nodemailer (SMTP), Browser Print Engine

---

## ⚙️ Setup & Installation

1.  **Clone and Install:**
    ```bash
    npm install
    ```
2.  **Environment Variables (`.env`):**
    Create a `.env` file in the root directory:
    ```env
    GOOGLE_CLIENT_ID=your_id
    GOOGLE_CLIENT_SECRET=your_secret
    GOOGLE_REDIRECT_URI=http://localhost:3000/
    GEMINI_API_KEY=your_key
    YOUR_EMAIL=your_gmail
    YOUR_APP_PASSWORD=gmail_app_password
    REFRESH_TOKEN=your_refresh_token
    ```
3.  **Run the App:**
    ```bash
    node index.js
    ```

---

## 🎯 Demo Guide
1.  **Sync:** Click **Refresh Sync** to pull live events from Google Calendar.
2.  **Listen:** Click **🔊 Play Audio Brief** to hear the AI read the strategic plan.
3.  **Export:** Click **📄 Export to PDF** to see the formatted 2026 Strategy Briefing.
4.  **Integrate:** Click **# Push to Slack** to see the ecosystem notification simulation.

---
**Developed by Reeti | 2026 Salesforce Technical Assessment**
