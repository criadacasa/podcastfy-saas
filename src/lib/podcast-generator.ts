// Podcast Generator - Real implementation using OpenAI API
// This module generates podcasts using GPT-4 for script generation and TTS for audio

export interface PodcastConfig {
  length: 'short' | 'medium' | 'long';
  language: string;
  speakers: number;
  style: string;
  voiceModel: string;
  generateTranscript: boolean;
}

export interface PodcastContent {
  contentType: 'urls' | 'youtube' | 'pdf' | 'image' | 'topic';
  input: any;
}

export interface GenerationResult {
  success: boolean;
  audioUrl?: string;
  transcript?: string;
  duration?: number;
  error?: string;
}

// Voice mapping for OpenAI TTS
const VOICE_MAP: { [key: number]: string[] } = {
  1: ['alloy'],
  2: ['alloy', 'echo'],
  3: ['alloy', 'echo', 'fable']
};

/**
 * Generate a podcast conversation script using GPT-4
 */
export async function generateScript(
  content: PodcastContent,
  config: PodcastConfig,
  openaiApiKey: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = buildUserPrompt(content, config);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: getMaxTokens(config.length)
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Convert script to audio using OpenAI TTS
 */
export async function generateAudio(
  script: string,
  config: PodcastConfig,
  openaiApiKey: string
): Promise<ArrayBuffer> {
  // For multi-speaker, we'll use a single voice for now (can be enhanced later)
  const voice = VOICE_MAP[config.speakers][0];

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: voice,
      input: script,
      response_format: 'mp3'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS error: ${response.status} - ${error}`);
  }

  return await response.arrayBuffer();
}

/**
 * Store audio in R2 bucket
 */
export async function storeAudio(
  audioBuffer: ArrayBuffer,
  jobId: string,
  r2Bucket: R2Bucket
): Promise<string> {
  const filename = `podcast-${jobId}.mp3`;
  
  await r2Bucket.put(filename, audioBuffer, {
    httpMetadata: {
      contentType: 'audio/mpeg'
    }
  });

  return filename;
}

/**
 * Get public URL for audio file
 */
export function getAudioUrl(filename: string, bucketUrl: string): string {
  return `${bucketUrl}/${filename}`;
}

// Helper functions

function buildSystemPrompt(config: PodcastConfig): string {
  const speakerText = config.speakers === 1 
    ? 'You are a podcast host.' 
    : `You are creating a ${config.speakers}-person podcast conversation.`;
  
  const styleText = {
    'casual': 'Use a casual, friendly tone with natural conversation flow.',
    'professional': 'Maintain a professional, informative tone.',
    'educational': 'Focus on clear explanations and educational value.',
    'entertaining': 'Be engaging and entertaining while staying informative.'
  }[config.style] || 'Be engaging and informative.';

  const lengthText = {
    'short': 'Keep it concise, around 2-5 minutes of content (300-750 words).',
    'medium': 'Aim for 5-15 minutes of content (750-2250 words).',
    'long': 'Create detailed content for 30+ minutes (4500+ words).'
  }[config.length];

  return `${speakerText}

${styleText}

${lengthText}

Format your response as a natural conversation script. ${config.speakers > 1 ? 'Use Speaker 1, Speaker 2, etc. labels for each speaker\'s lines.' : ''}

Make it engaging, informative, and natural-sounding. Avoid being overly formal or robotic.`;
}

function buildUserPrompt(content: PodcastContent, config: PodcastConfig): string {
  let contentDescription = '';

  switch (content.contentType) {
    case 'urls':
      contentDescription = `Create a podcast discussing the content from these URLs:\n${content.input.urls.join('\n')}`;
      break;
    case 'youtube':
      contentDescription = `Create a podcast discussing these YouTube videos:\n${content.input.youtube.join('\n')}`;
      break;
    case 'topic':
      contentDescription = `Create a podcast about this topic: ${content.input.topic}`;
      break;
    case 'pdf':
      contentDescription = `Create a podcast discussing the uploaded PDF documents (${content.input.files.length} files).`;
      break;
    case 'image':
      contentDescription = `Create a podcast discussing the uploaded images (${content.input.files.length} images).`;
      break;
  }

  return `${contentDescription}

Language: ${config.language}

Generate an engaging podcast conversation that covers the main points, insights, and interesting aspects of this content.`;
}

function getMaxTokens(length: string): number {
  const tokenMap = {
    'short': 1000,
    'medium': 3000,
    'long': 6000
  };
  return tokenMap[length as keyof typeof tokenMap] || 3000;
}
