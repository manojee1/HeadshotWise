import { Router, Request, Response } from 'express';
import { upload, handleUploadError } from '../middleware/upload';
import { asyncHandler } from '../middleware/errorHandler';
import { ImageService } from '../services/imageService';
import { GeminiService } from '../services/geminiService';
import { StyleType } from '../types';

const router = Router();
const imageService = new ImageService();
const geminiService = new GeminiService();

// Health check endpoint
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  const isApiConnected = await geminiService.validateApiConnection();
  
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      apiConnected: isApiConnected
    }
  });
}));

// Generate headshot endpoint
router.post('/generate', upload.single('image'), handleUploadError, asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { style } = req.body;
    
    if (!style || !['corporate', 'creative', 'executive'].includes(style)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid style. Must be one of: corporate, creative, executive'
      });
    }

    console.log(`Processing headshot generation request for style: ${style}`);

    // Validate and process uploaded image
    imageService.validateFile(req.file);
    const processedImage = await imageService.processUploadedImage(req.file);

    // Generate headshot using Gemini API
    console.log('Generating headshot with Gemini API...');
    const generatedImageBuffer = await geminiService.generateHeadshot(
      req.file.buffer,
      style as StyleType
    );

    // Save generated image
    const generatedImagePath = await imageService.saveGeneratedImage(
      generatedImageBuffer,
      style
    );

    // Convert images to base64 for response
    const originalImageBase64 = await imageService.getImageAsBase64(processedImage.processedPath);
    const generatedImageBase64 = await imageService.getImageAsBase64(generatedImagePath);

    const processingTime = Date.now() - startTime;

    console.log(`Headshot generation completed in ${processingTime}ms`);

    // Clean up temporary files
    await imageService.cleanupFile(processedImage.originalPath);
    await imageService.cleanupFile(processedImage.processedPath);

    return res.json({
      success: true,
      data: {
        originalImage: `data:image/jpeg;base64,${originalImageBase64}`,
        generatedImage: `data:image/jpeg;base64,${generatedImageBase64}`,
        style: style,
        processingTime: processingTime
      }
    });

  } catch (error) {
    console.error('Error in headshot generation:', error);
    
    // Clean up any temporary files on error
    if (req.file) {
      try {
        const processedImage = await imageService.processUploadedImage(req.file);
        await imageService.cleanupFile(processedImage.originalPath);
        await imageService.cleanupFile(processedImage.processedPath);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}));

// Get available styles
router.get('/styles', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      styles: [
        {
          id: 'corporate',
          name: 'Corporate Classic',
          description: 'Traditional business headshot, neutral background, formal lighting'
        },
        {
          id: 'creative',
          name: 'Creative Professional',
          description: 'Modern dynamic styling, artistic background, contemporary lighting'
        },
        {
          id: 'executive',
          name: 'Executive Portrait',
          description: 'Premium, formal styling, sophisticated lighting'
        }
      ]
    }
  });
}));

export default router;
