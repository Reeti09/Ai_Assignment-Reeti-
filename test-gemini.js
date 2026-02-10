const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function runTest() {
  // 1. Initialize the API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // 2. Select the "Flash" model (Fast & Free)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are a professional sales researcher for Salesforce. Your goal is to provide high-level strategic insights for meetings with C-suite executives."
  });

  const prompt = `
    Prepare a meeting brief for a meeting with:
    Prospect: Sarah
    Company: Walmart
    Role: Senior Director of Marketing
    
    Please provide:
    - Likely Pain Points
    - Strategic Talking Points
    - Personality/Approach tips
  `;

  try {
    console.log("🤖 Asking Gemini to research Sarah from Walmart...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("\n--- TEST SUCCESSFUL! AI RESPONSE BELOW ---\n");
    console.log(text);
  } catch (error) {
    console.error("❌ TEST FAILED!");
    console.error(error.message);
  }
}

runTest();