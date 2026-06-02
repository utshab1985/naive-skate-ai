import { GoogleGenerativeAI } from '@google/generative-ai';
import { existsSync, readFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

function getRelevantProducts(products: any[], userMessage: string): any[] {
  const msg = userMessage.toLowerCase();
  let filtered: any[] = products;

  if (msg.includes('wheel')) {
    filtered = products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes('wheel'));
  } else if (msg.includes('deck') || msg.includes('board')) {
    filtered = products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes('deck'));
  } else if (msg.includes('truck')) {
    filtered = products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes('truck'));
  } else if (msg.includes('bearing')) {
    filtered = products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes('bearing'));
  } else if (msg.includes('grip')) {
    filtered = products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes('grip'));
  } else {
    const categories = ['deck', 'wheel', 'truck', 'bearing', 'grip'];
    filtered = categories.flatMap((cat: string) =>
      products.filter((p: any) => (p.name || p.title || '').toLowerCase().includes(cat)).slice(0, 2)
    );
  }

  return filtered.slice(0, 15);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const messages: any[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ role: 'assistant', content: 'Hi! Ask me anything about skateboards.' });
    }

    const lastMessage: string = messages[messages.length - 1]?.content;

    if (!lastMessage || typeof lastMessage !== 'string' || lastMessage.trim().length < 2) {
      return NextResponse.json({ role: 'assistant', content: "I didn't quite catch that! Try asking me about skateboards, wheels, trucks, or your budget." });
    }

    const filePath = join(process.cwd(), 'reference', 'products.json');
    let products: any[] = [];
    if (existsSync(filePath)) {
      const fileData = readFileSync(filePath, 'utf8');
      products = JSON.parse(fileData);
    }

    const relevantProducts = getRelevantProducts(products, lastMessage);
    const productContext = relevantProducts.map((p: any) => {
      return `- ${p.title} | Description: ${p.description} | Price: $${p.priceRange?.maxVariantPrice?.amount || 'N/A'}`;
    }).join('\n');

    const systemPrompt = `You are a helpful skateboard shopping assistant for Naive Skate Inc.
Only recommend products from this catalog:
${productContext}

Strict Rules:
1. If the user input is gibberish, off-topic, or unrelated to skateboarding, politely steer them back to asking about skateboards.
2. Only recommend real products from the list above.
3. Mention the product name and price when recommending.
4. TKP trucks = street skating, RKP trucks = longboards.
5. Soft wheels (75a-83a) = cruising, hard wheels (99A-101A) = tricks.
6. Be friendly and concise.
7. Never make up products that are not in the catalog.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
    });

    const validHistory = messages
      .slice(0, -1)
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .filter((_: any, i: number) => i !== 0)
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const safeHistory = validHistory.length > 0 && (validHistory[0] as any).role === 'user'
      ? validHistory
      : [];

    const chat = model.startChat({ history: safeHistory });
    const result = await chat.sendMessage(lastMessage);
    const content = result.response.text();

    return NextResponse.json({ role: 'assistant', content });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      role: 'assistant',
      content: 'Sorry, I am having trouble right now. Please try again in a moment.'
    }, { status: 500 });
  }
}