import { GoogleGenAI } from '@google/genai';
import { Memory, StructuredAnswer, Department } from '../../src/types';
import { CONFIG } from '../config';

export interface AIProviderParams {
  question: string;
  department: Department;
  role: string;
  userName: string;
  memories: Memory[];
}

export interface IAIProvider {
  name: string;
  generateResponse(params: AIProviderParams): Promise<StructuredAnswer>;
}

const SYSTEM_PROMPT = `You are the FRICTIONFIX Intelligence Engine, an organizational memory assistant for enterprise customer journeys.
Your answers must strictly synthesize and remain grounded in the provided Organizational Memories.

You MUST return your response ONLY as a JSON object with this exact schema:
{
  "summary": "Brief 1-2 sentence overall answer to the user's question.",
  "observed": [
    "Fact 1 directly supported by evidence in memories",
    "Fact 2 supported by memories"
  ],
  "inferred": [
    "Deduction or potential root cause derived from observations",
    "Department impact analysis"
  ],
  "recommended": [
    "Actionable step 1",
    "Actionable step 2"
  ],
  "historicalContext": "Description of past incidents, previous actions taken, and historical outcomes if available in memories."
}

Do NOT wrap in markdown backticks or extra text outside JSON if possible. Make sure your observations directly cite numbers and evidence from the memories.`;

export class GeminiProvider implements IAIProvider {
  public name = 'Gemini';
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (CONFIG.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });
    }
  }

  async generateResponse(params: AIProviderParams): Promise<StructuredAnswer> {
    if (!this.ai) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    const memoriesText = params.memories.map((m, idx) => 
      `Memory ${idx + 1}:
- Department: ${m.department}
- Entity: ${m.entity}
- Observation: ${m.observation}
- Evidence: ${m.evidence}
- Date: ${m.date}
- Historical Action: ${m.historicalAction || 'N/A'}
- Outcome: ${m.outcome || 'N/A'}`
    ).join('\n\n');

    const userPrompt = `User Context:
- Name: ${params.userName}
- Role: ${params.role}
- Department: ${params.department}

User Question: "${params.question}"

Retrieved Organizational Memories (${params.memories.length}):
${memoriesText}

Please generate the grounded response adhering to the system prompt JSON format.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
    });

    const text = response.text || '';
    return parseJSONAnswer(text, params);
  }
}

export class OpenAIProvider implements IAIProvider {
  public name = 'OpenAI';

  async generateResponse(params: AIProviderParams): Promise<StructuredAnswer> {
    if (!CONFIG.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    const memoriesText = params.memories.map((m, idx) => 
      `[Memory ${idx + 1}] (${m.department}) ${m.entity}: ${m.observation} | Evidence: ${m.evidence} | Date: ${m.date}`
    ).join('\n');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Department: ${params.department}\nQuestion: ${params.question}\nMemories:\n${memoriesText}` }
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API returned error ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices[0]?.message?.content || '';
    return parseJSONAnswer(text, params);
  }
}

export class GroqProvider implements IAIProvider {
  public name = 'Groq';

  async generateResponse(params: AIProviderParams): Promise<StructuredAnswer> {
    if (!CONFIG.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    const memoriesText = params.memories.map((m, idx) => 
      `[Memory ${idx + 1}] (${m.department}) ${m.entity}: ${m.observation} | Evidence: ${m.evidence}`
    ).join('\n');

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Department: ${params.department}\nQuestion: ${params.question}\nMemories:\n${memoriesText}` }
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq API returned error ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices[0]?.message?.content || '';
    return parseJSONAnswer(text, params);
  }
}

export class MockAIProvider implements IAIProvider {
  public name = 'Demo Memory LLM';

  async generateResponse(params: AIProviderParams): Promise<StructuredAnswer> {
    // Artificial slight delay for realistic processing feel
    await new Promise(r => setTimeout(r, 600));

    const { question, department, memories } = params;
    const qLower = question.toLowerCase();

    // Check for P500 specific question
    if (qLower.includes('p500') || qLower.includes('compatibility')) {
      const p500CS = memories.find(m => m.department === 'Customer Service');
      const p500Prod = memories.find(m => m.department === 'Product');

      if (department === 'Product') {
        return {
          summary: 'Recent organizational memory confirms that P500 has experienced recurring compatibility friction during legacy API integrations.',
          observed: [
            '137 recent customer support conversations explicitly mention compatibility confusion.',
            '42 developer portal tickets were logged regarding legacy integration friction.',
            'A similar compatibility issue was recorded in May 2026 post-mortem #PM-2026-05.'
          ],
          inferred: [
            'Recent API release v4.2 may have altered legacy endpoint behavior without adequate migration guides.',
            'Cross-department data shows Customer Service handling elevated ticket resolution times for P500.'
          ],
          recommended: [
            'Review legacy endpoint compatibility documentation for P500 v4.2 release.',
            'Determine if May 2026 FAQ update measures need to be expanded into detailed code samples.'
          ],
          historicalContext: 'During the May 2026 incident, updating the Product FAQ temporarily reduced support volume by 34%. However, the recurrence in September indicates deeper integration documentation gaps.'
        };
      } else if (department === 'Marketing') {
        return {
          summary: 'Organizational memory indicates P500 compatibility friction is negatively impacting customer acquisition expectations.',
          observed: [
            '450 customer feedback survey responses highlighted messaging confusion around enterprise sync capabilities.',
            '137 support tickets tagged #compatibility originated from newly onboarded customers.'
          ],
          inferred: [
            'Marketing campaigns emphasized feature capabilities that legacy systems cannot support without integration setup.',
            'Prospects are experiencing friction immediately post-onboarding due to set-up expectations.'
          ],
          recommended: [
            'Align campaign landing page messaging with current P500 system compatibility prerequisites.',
            'Add explicit legacy environment requirements to pre-sales collateral.'
          ],
          historicalContext: 'In May 2026, product documentation updates alleviated support load, but campaign messaging was not synchronized at that time.'
        };
      } else {
        // Customer Service
        return {
          summary: 'Customer Service records show a 137-ticket spike in P500 compatibility complaints following the v4.2 update.',
          observed: [
            '137 support tickets tagged #compatibility and #legacy-api since September 2026.',
            'Average ticket handling time increased by 4.2 minutes for P500 inquiries.'
          ],
          inferred: [
            'Tier-1 support reps lack clear resolution scripts for legacy API integration errors.',
            'Product engineering team updates have not yet reached the customer support knowledge base.'
          ],
          recommended: [
            'Escalate P500 v4.2 error patterns to Product Management.',
            'Publish internal support macro based on the May 2026 Product FAQ resolution.'
          ],
          historicalContext: 'In May 2026, Product FAQ deployment enabled CS reps to resolve compatibility inquiries 34% faster.'
        };
      }
    }

    // Campaign or conversion query
    if (qLower.includes('conversion') || qLower.includes('campaign')) {
      return {
        summary: `Organizational memory shows a recent 18% conversion drop linked to Q3 growth campaign copy testing.`,
        observed: [
          'Conversion rate dropped by 18% following headline variant B deployment.',
          '12,400 user session recordings showed drop-offs at the primary call-to-action.'
        ],
        inferred: [
          'Headline variant B created message mismatch between ad copy and landing page headers.',
          'Cross-department impact on Customer Service inquiry rates remained low.'
        ],
        recommended: [
          'Maintain headline variant A baseline until copy variant C finishes audit.',
          'Conduct qualitative review of 450 customer feedback surveys.'
        ],
        historicalContext: 'Reverting headline copy during previous test restored baseline conversion metrics within 48 hours.'
      };
    }

    // General fallback grounded response
    const obsList = memories.map(m => `[${m.department}] ${m.entity}: ${m.observation} (${m.evidence})`);
    return {
      summary: `Based on ${memories.length} organizational memories retrieved for ${department}, several historical patterns were identified.`,
      observed: obsList.slice(0, 3),
      inferred: [
        `Cross-department memory indicates shared friction points between ${department} and related teams.`,
        'Entity trends suggest recurring operational patterns requiring review.'
      ],
      recommended: [
        'Investigate retrieved memory evidence points with relevant department leads.',
        'Document resolution in Hindsight memory store.'
      ],
      historicalContext: memories.find(m => m.historicalAction)?.historicalAction 
        ? `Previous action: ${memories.find(m => m.historicalAction)?.historicalAction}. Outcome: ${memories.find(m => m.outcome)?.outcome || 'Recorded in memory.'}`
        : 'Historical memory records show prior occurrences logged in system registry.'
    };
  }
}

function parseJSONAnswer(text: string, params: AIProviderParams): StructuredAnswer {
  try {
    // Remove markdown block backticks if present
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary || 'Summary generated from organizational memory.',
      observed: Array.isArray(parsed.observed) ? parsed.observed : [parsed.observed || 'Evidence recorded in memory.'],
      inferred: Array.isArray(parsed.inferred) ? parsed.inferred : [parsed.inferred || 'Inference drawn from patterns.'],
      recommended: Array.isArray(parsed.recommended) ? parsed.recommended : [parsed.recommended || 'Review related memories.'],
      historicalContext: parsed.historicalContext || 'Historical context available in memory sources.',
    };
  } catch (err) {
    // Fallback parser if JSON generation was non-standard
    return {
      summary: text.slice(0, 200) + '...',
      observed: params.memories.map(m => m.observation),
      inferred: [`Analysis based on ${params.department} context and question.`],
      recommended: ['Review retrieved organizational memories below.'],
      historicalContext: 'Extracted from organizational memory store.'
    };
  }
}

export function getAIProvider(): IAIProvider {
  const providerType = CONFIG.AI_PROVIDER;

  if (providerType === 'gemini' && CONFIG.GEMINI_API_KEY) {
    return new GeminiProvider();
  } else if (providerType === 'openai' && CONFIG.OPENAI_API_KEY) {
    return new OpenAIProvider();
  } else if (providerType === 'groq' && CONFIG.GROQ_API_KEY) {
    return new GroqProvider();
  }

  // Fallback to Mock AI Provider
  return new MockAIProvider();
}
