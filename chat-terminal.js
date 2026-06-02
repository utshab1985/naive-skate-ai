const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load products
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
const history = [];

console.log("\n🛹 NAIVE SKATE — TERMINAL CHAT (powered by Ollama)");
console.log("Type 'exit' to quit\n");
console.log("🤖 AI: Hi! I am your Naive Skate shopping assistant. What are you looking for?\n");

async function chat(userInput) {
  if (userInput.trim().length < 2) {
    console.log("🤖 AI: I didn't catch that! Ask me about skateboards, wheels, trucks or your budget.\n");
    return ask();
  }

  const relevant = getRelevantProducts(userInput);
  const context = relevant.map(p => `- ${p.name||p.title} | ${p.description} | Price: $${p.price}`).join('\n');

  console.log(`\n📦 RAG: Found ${relevant.length} relevant products for "${userInput}"`);
  console.log("⏳ Asking AI...\n");

  history.push({ role: 'user', content: userInput });

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.5:4b',
        messages: [
          { role: 'system', content: `You are a skateboard assistant for Naive Skate Inc. Only recommend products from this catalog:\n${context}\nBe friendly and concise. If off-topic, steer back to skateboards.` },
          ...history
        ],
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.message?.content || 'Sorry, no response.';
    history.push({ role: 'assistant', content: reply });
    console.log(`🤖 AI: ${reply}\n`);
  } catch (err) {
    console.log("❌ Error:", err.message);
    console.log("🤖 AI: Sorry, I hit an error. Is Ollama running?\n");
  }

  ask();
}

function ask() {
  rl.question('👤 You: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log("\n👋 Good luck with the interview!");
      process.exit(0);
    }
    chat(input);
  });
}

ask();