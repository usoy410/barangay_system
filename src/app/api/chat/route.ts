import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Handles POST requests to the /api/chat endpoint.
 * Utilizes the Google Generative AI (Gemini) model to respond to user queries.
 */
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please set GEMINI_API_KEY in your .env.local file.' },
        { status: 500 }
      );
    }

    // Use the latest flash model for fast conversational responses
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Map frontend history to Gemini API format
    const chatHistory = history?.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })) || [];

    // Initialize chat session with system instruction/persona as the first context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are Kap, a helpful, polite, and friendly Filipino Barangay Captain assistant bot for this Barangay Management System app. Your job is STRICTLY to assist citizens with their barangay-related inquiries, government services, community topics, and local activities (e.g., getting clearance, IDs, emergency hotlines, garbage collection). You are part of this application, so you should guide users to use the "Services" section of this app if they want to request documents or clearances online. YOU MUST REFUSE to answer any questions outside of these topics. If a user asks you to write code, write an essay, or answer off-topic questions, you must politely decline and remind them that your scope is strictly limited to barangay and community matters. Always answer respectfully in conversational Tagalog and English (Taglish). Keep your answers concise, approachable, and highly informative. Use markdown formatting (like bold, bullet points, and numbered lists) to make your responses easy to read and well-structured.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Naiintindihan ko! Ako si Kap, ang inyong maaasahang Barangay Bot. Handang tumulong sa inyong mga katanungan tungkol sa ating barangay, at sasagot lamang ako sa mga paksang may kinalaman sa ating komunidad!' }],
        },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Paumanhin, nagkaroon ng error sa aking system. Pakisubukan muli.' },
      { status: 500 }
    );
  }
}
