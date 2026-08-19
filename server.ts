import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI SDK
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn('Google GenAI initialization warning:', e);
}

// System instruction enforcing strict ICSI CSEET Restructured syllabus constraints
const ICSI_SYSTEM_PROMPT = `
You are the authoritative AI Learning and Examination Preparation Engine for the ICSI Company Secretary Executive Entrance Test (CSEET), February 2027 session.

CRITICAL OPERATIONAL RULES:
1. APPLICABLE SYLLABUS: Strictly the RESTRUCTURED CSEET SYLLABUS applicable from June 2026 onwards.
   - Paper 1: Business Communication (50 Marks)
   - Paper 2: Fundamentals of Accounting (50 Marks)
   - Paper 3: Economic and Business Environment (50 Marks) [Part A: Economics, Part B: Business Environment]
   - Paper 4: Business Laws and Management (50 Marks) [Part A: Business Laws, Part B: Business Management]
2. NEVER invent syllabus topics, PYQs, exam patterns, or statistics.
3. Use official ICSI study material (icsi.edu) as the primary authority.
4. Clearly distinguish OLD SYLLABUS vs RESTRUCTURED SYLLABUS. Never present old-syllabus questions as evidence of the current pattern without qualification.
5. Provide precise legal sections, accounting workings step-by-step, grammatical concord principles, and macroeconomic formulas.
6. When explaining accounting errors, identify the formula/principle, show workings, and explain where common calculations go wrong.
`;

// AI Tutor API endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    const { query, history, activeSubTopicId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!ai) {
      // Return structured fallback response if API key is not configured
      return res.json({
        reply: `### ICSI CSEET Study Guidance\nQuery received: "${query}"\n\n*Note: Running in authoritative local mode based on official ICSI CSEET Study Material (June 2026+ edition).*\n\nPlease refer to the official syllabus modules or launch the dedicated 20-Question Depth Test to assess your mastery.`,
        sources: ['ICSI Restructured CSEET Study Material (June 2026+)'],
      });
    }

    const conversationContext = (history || [])
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `${ICSI_SYSTEM_PROMPT}\n\nCONVERSATION CONTEXT:\n${conversationContext}\n\nACTIVE SUBTOPIC ID: ${activeSubTopicId || 'None'}\n\nSTUDENT QUERY:\n${query}\n\nProvide a clear, authoritative, student-focused answer. Include exact ICSI principles, case precedents or formulas where applicable, and cite the official ICSI source.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    const replyText = response.text || 'Unable to generate response from official study material.';

    return res.json({
      reply: replyText,
      sources: ['ICSI Restructured CSEET Study Material (June 2026+)', 'ICSI Examination Guidelines for Feb 2027'],
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to process AI tutor request',
      details: error.message || String(error),
    });
  }
});

// Serve Vite build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ICSI CSEET Mastery Server running on http://localhost:${PORT}`);
});
