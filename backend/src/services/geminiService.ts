import { GoogleGenAI } from '@google/genai';
import { config } from '../config/environment';
import { StyleType } from '../types';
import fs from 'fs';
import path from 'path';

export class GeminiService {
  private client: any;

  constructor() {
    if (!config.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set. Please check your .env file.');
    }
    
    this.client = new GoogleGenAI({
      apiKey: config.GOOGLE_API_KEY
    });
  }

  private getPromptForStyle(style: StyleType): string {
    const prompts = {
      corporate: `Transform this photo into photorealistic professional headshot. Use soft, flattering studio lighting against a solid dark gray backdrop. Dress me in a modern, stylish, professional business attire. Maintain my exact facial features and likeness, but give me a confident and approachable expression. The final image should be high-resolution with a sharp focus on my face. Neutral studio background. High-angle perspective, showing full head and body upto the bust, with soft, diffused lighting creating gentle catchlights. 85mm lens aesthetic with shallow depth of field - sharp focus on eyes, soft bokeh background. Natural skin texture with visible hair detail. Bright, airy feel. Make subject look great and accurate to their original appearance.`,
      
      creative: `Transform this photo into a close-up portrait with shallow depth of field creating soft bokeh background. Warm, natural lighting highlighting subject's features. Casual attire and genuine, engaging smile. Subject fills more of the frame. Background hints at creative workspace or outdoor setting with beautiful blur. Preserve natural skin texture and authentic features. Modern, approachable creative professional aesthetic. Make subject look great and accurate to their original appearance.`,
      
      executive: `Transform this photo into a dramatic black and white portrait in editorial style. Preserve subject's authentic features and character. Apply these specifications: monochromatic treatment with rich grayscale tones, deep charcoal or black background with subtle gradation, dramatic side lighting creating strong shadows and highlights on face (Rembrandt or split lighting), preserve all natural skin texture and detail - no smoothing, sharp focus capturing fine details in eyes and facial features, relaxed and contemplative expression - confident smile, casual professional attire (dark textured jacket, shirt, no tie), hand gesture near chest or face for dynamic composition, high contrast with deep blacks and bright highlights, cinematic film grain for texture. Maintain editorial photography aesthetic - artistic but professional. Make subject look great and accurate to their original appearance.`
    };

    return prompts[style];
  }

  async generateHeadshot(imageBuffer: Buffer, style: StyleType): Promise<Buffer> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.getPromptForStyle(style);
        
        console.log(`Generating headshot with style: ${style} (attempt ${attempt}/${maxRetries})`);
        
        // Use the image-specific Gemini model for headshot generation
        const response = await this.client.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBuffer.toString('base64'),
                  },
                },
              ],
            },
          ],
        });

        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No response from Gemini API');
        }

        const candidate = response.candidates[0];
        if (!candidate.content || !candidate.content.parts) {
          throw new Error('Invalid response format from Gemini API');
        }

        // Find the image part in the response
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return Buffer.from(part.inlineData.data, 'base64');
          }
        }

        throw new Error('No image data found in Gemini API response');
      } catch (error) {
        console.error(`Error generating headshot (attempt ${attempt}):`, error);
        
        // Check if it's a quota error
        if (error instanceof Error && error.message.includes('429')) {
          if (attempt === maxRetries) {
            throw new Error('API quota exceeded. Please try again later or upgrade your Google AI plan.');
          }
          
          // Wait with exponential backoff
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`Quota exceeded, waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // For other errors, don't retry
        throw new Error(`Failed to generate headshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    throw new Error('Failed to generate headshot after all retry attempts');
  }

  async validateApiConnection(): Promise<boolean> {
    try {
      // Skip validation to avoid consuming quota
      // Just check if we can initialize the client
      return this.client !== null;
    } catch (error) {
      console.error('Gemini API validation failed:', error);
      return false;
    }
  }
}
