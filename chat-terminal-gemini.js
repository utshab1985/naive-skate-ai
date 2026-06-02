const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const env = fs.readFileSync('.env.local', 'utf8');
const apiKey = env.match(/GEMINI_API_KEY=(.+)/)[1].trim();
const genAI = new GoogleGenerativeAI(apiKey);

const filePath = path.join(process.cwd(), 'reference', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function getRelevantProducts(userMessage) {
  const msg = userMessage.toLowerCase();
  let filtered = products;
  if (msg.includes('wheel')) filtered = products.filter(p => (p.name||p.title||'').toLowerCase().includes('wheel'));
  else if (msg.includes('deck') || msg.includes('board')) filtered = products.filter(p => (p.name||p.title||'').toLowerCase().includes('deck'));
  else if (msg.includes('truck')) filtered = products.filter(p => (p.name||p.title||'').toLowerCase().includes('truck'));
  else if (msg.includes('bearing')) filtered = products.filter(p => (p.name||p.title||'').toLowerCase().includes('bearing'));
  else if (msg.includes('grip')) filtered = products.filter(p => (p.name||p.title||'').toLowerCase().includes('grip'));
  else filtered = products.slice(0, 5);
  return filtered.slice(0, 10);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const conversationMessages = [];

console.log("\n🛹 NAIVE SKATE — TERMINAL CHAT (Gemini 2.5 Flash)");
console.log("Type 'exit' to quit\n");
console.log("🤖 AI: Hi! I am your Naive Skate shopping assistant. What are you looking for?\n");

async function sendMessage(userInput) {
  if (userInput.trim().length < 2) {
    console.log("🤖 AI: I didn't catch that! Ask me about skateboards, wheels, trucks or your budget.\n");
    return askQuestion();
  }

  const relevant = getRelevantProducts(userInput);
  const context = relevant.map(p => `- ${p.title} | ${p.description} | Price: $${p.priceRange?.maxVariantPrice?.amount || 'N/A'}`).join('\n');

  console.log(`\n📦 RAG: Found ${relevant.length} relevant products`);
  console.log("⏳ Asking Gemini...\n");

  conversationMessages.push({ role: 'user', content: userInput });

  try {
    const systemPrompt = `You are a helpful skateboard shopping assistant for Naive Skate Inc.
Only recommend products from this catalog:
${context}

Rules:
1. Only recommend real products from the list above
2. Mention product name and price when recommending
3. TKP trucks = street skating, RKP trucks = longboards
4. Soft wheels (75a-83a) = cruising, hard wheels (99A-101A) = tricks
5. If off-topic or gibberish, politely steer back to skateboards
6. Be friendly and concise`;

    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite-001',
      systemInstruction: systemPrompt,
    });

    const validHistory = conversationMessages
      .slice(0, -1)
      .filter((_, i) => i !== 0)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const safeHistory = validHistory.length > 0 && validHistory[0].role === 'user'
      ? validHistory
      : [];

    const geminiChat = geminiModel.startChat({ history: safeHistory });
    const result = await geminiChat.sendMessage(userInput);
    const reply = result.response.text();

    conversationMessages.push({ role: 'assistant', content: reply });
    console.log(`🤖 AI: ${reply}\n`);

  } catch (err) {
    console.log("❌ Error:", err.message);
    console.log("🤖 AI: Sorry, I hit an error. Please try again.\n");
  }

  askQuestion();
}

function askQuestion() {
  rl.question('👤 You: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log("\n👋 Good luck with the interview!");
      process.exit(0);
    }
    sendMessage(input);
  });
}

askQuestion();