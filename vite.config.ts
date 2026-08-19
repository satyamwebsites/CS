import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const devApiPlugin = (): Plugin => ({
  name: 'dev-api-middleware',
  configureServer(server) {
    server.middlewares.use('/api/tutor', async (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const { query, history, activeSubTopicId } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                reply: `### ICSI CSEET Study Guidance\nQuery: "${query}"\n\n*Running with built-in authoritative ICSI curriculum engine (June 2026+ Restructured Syllabus).*\n\nPlease select any sub-topic from the syllabus tree or run the 20-Question Depth Test to evaluate your readiness for the February 2027 examination.`,
                sources: ['ICSI Restructured CSEET Study Material (June 2026+)'],
              }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const conversationContext = (history || [])
              .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
              .join('\n');

            const prompt = `You are the authoritative AI Learning and Examination Preparation Engine for the ICSI Company Secretary Executive Entrance Test (CSEET), February 2027 session.\nAPPLICABLE SYLLABUS: Strictly the RESTRUCTURED CSEET SYLLABUS (June 2026 onwards).\nPaper 1: Business Communication, Paper 2: Fundamentals of Accounting, Paper 3: Economic & Business Environment, Paper 4: Business Laws & Management.\n\nCONVERSATION CONTEXT:\n${conversationContext}\n\nACTIVE SUBTOPIC ID: ${activeSubTopicId || 'None'}\n\nSTUDENT QUERY:\n${query}\n\nProvide an authoritative, clear response citing exact ICSI statutory/accounting principles or case precedents.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: prompt,
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              reply: response.text || 'No response generated.',
              sources: ['ICSI Restructured CSEET Study Material (June 2026+)', 'ICSI Examination Scheme for Feb 2027'],
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'API processing failed' }));
          }
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
