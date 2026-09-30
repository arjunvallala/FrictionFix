import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';
import { hindsightService } from './services/hindsightService';
import { getAIProvider } from './services/aiProvider';
import { Department } from '../src/types';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Health & Config Status Endpoint
app.get('/api/health', (req, res) => {
  const hindsightConnected = hindsightService.isConnected();
  const provider = getAIProvider();
  const isDemoMode = !hindsightConnected || provider.name.includes('Demo');

  res.json({
    hindsightConnected,
    isDemoMode,
    aiProvider: CONFIG.AI_PROVIDER,
    configuredProvider: provider.name,
  });
});

// 2. Agent Query Endpoint (Context -> Hindsight Recall -> LLM Reasoning -> Grounded Response)
app.post('/api/agent/query', async (req, res) => {
  try {
    const { question, department, role, name, entity } = req.body as {
      question: string;
      department: Department;
      role: string;
      name: string;
      entity?: string;
    };

    if (!question || !department) {
      return res.status(400).json({ error: 'Question and department are required.' });
    }

    // Step 1: Recall relevant memories from Hindsight
    const memories = await hindsightService.recall({
      query: question,
      department,
      entity,
    });

    // Step 2: Invoke AI Provider (Gemini / OpenAI / Groq / Demo)
    const provider = getAIProvider();
    const answer = await provider.generateResponse({
      question,
      department,
      role: role || 'Member',
      userName: name || 'User',
      memories,
    });

    // Step 3: Return grounded response with source memory references
    return res.json({
      answer,
      memories,
      hindsightConnected: hindsightService.isConnected(),
      providerName: provider.name,
    });
  } catch (err: any) {
    console.error('Error in /api/agent/query:', err);
    return res.status(500).json({
      error: 'The intelligence service could not generate a response.',
      details: err.message || 'Unknown error occurred.',
    });
  }
});

// 3. Get Memories Endpoint
app.get('/api/memories', async (req, res) => {
  try {
    const department = req.query.department as Department | undefined;
    const memories = await hindsightService.getAllMemories(department);
    return res.json({ memories });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Retain Memory Endpoint
app.post('/api/memories', async (req, res) => {
  try {
    const memoryData = req.body;
    const createdMemory = await hindsightService.retain(memoryData);
    return res.json({ memory: createdMemory });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`[FRICTIONFIX Server] Running on http://localhost:${CONFIG.PORT}`);
  console.log(`[AI Provider] Selected: ${CONFIG.AI_PROVIDER} (${getAIProvider().name})`);
  console.log(`[Hindsight] Connection: ${hindsightService.isConnected() ? 'CONNECTED' : 'DEMO MODE'}`);
});
