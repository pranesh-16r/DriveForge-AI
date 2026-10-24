import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { buildSystemPrompt } from './src/lib/ai/aiPrompt';
import { DriveForgeAIContext } from './src/lib/ai/aiContext';
import { AIMessage } from './src/lib/ai/aiService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini Client dynamically
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY)
  });
});

// Primary Chief Engineer AI Endpoint
app.post('/api/ai/chief-engineer', async (req, res) => {
  try {
    const { context, messages } = req.body as {
      context: DriveForgeAIContext;
      messages: AIMessage[];
    };

    if (!context || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid context or messages array'
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: false,
        fallbackRequired: true,
        reason: 'No GEMINI_API_KEY configured'
      });
    }

    // Build system instruction grounded in the actual DriveForge context
    const systemInstruction = buildSystemPrompt(context);

    // Format conversation history for Gemini
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Please review my current vehicle and build configuration.' }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction
      }
    });

    const responseText = response.text || '';

    return res.json({
      success: true,
      text: responseText,
      provider: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('[DriveForge Chief Engineer Server Error]:', error);
    return res.json({
      success: false,
      fallbackRequired: true,
      error: error?.message || 'Gemini inference failed'
    });
  }
});

// AI Concept Render Image Generation Endpoint
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: false,
        reason: 'No GEMINI_API_KEY configured'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9' || aspectRatio === '1:1') ? aspectRatio : '16:9'
        }
      }
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      return res.json({ success: true, imageUrl });
    }

    return res.json({
      success: false,
      reason: 'No image data returned from model',
      text: response.text
    });
  } catch (error: any) {
    console.error('[Generate Image Server Error]:', error);
    return res.json({
      success: false,
      error: error?.message || 'Image generation failed'
    });
  }
});

// Veo 3 Video Generation Endpoint
app.post('/api/ai/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: false,
        reason: 'No GEMINI_API_KEY configured'
      });
    }

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '16:9'
      }
    });

    return res.json({
      success: true,
      operationName: operation.name
    });
  } catch (error: any) {
    console.error('[Generate Video Server Error]:', error);
    return res.json({
      success: false,
      error: error?.message || 'Video generation request failed'
    });
  }
});

// Boot development or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DriveForge AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
