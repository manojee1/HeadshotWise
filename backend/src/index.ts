import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import headshotRoutes from './routes/headshot';
import { ImageService } from './services/imageService';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request from origin:', origin);
    console.log('Allowed origins:', config.CORS_ORIGINS);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      console.log('Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (config.CORS_ORIGINS.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, true);
    }
    
    // For development, allow localhost with any port
    if (config.NODE_ENV === 'development' && origin && origin.includes('localhost')) {
      console.log('Allowing localhost in development:', origin);
      return callback(null, true);
    }
    
    // Reject other origins
    console.log('Origin rejected:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/headshot', headshotRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HeadshotPro AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/headshot/health',
      generate: '/api/headshot/generate',
      styles: '/api/headshot/styles'
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services
const imageService = new ImageService();

// Setup cleanup interval
setInterval(async () => {
  try {
    await imageService.cleanupOldFiles();
  } catch (error) {
    console.error('Error during scheduled cleanup:', error);
  }
}, config.CLEANUP_INTERVAL);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 HeadshotPro AI Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
  console.log(`📁 Upload Directory: ${config.UPLOAD_DIR}`);
  console.log(`🧹 Cleanup Interval: ${config.CLEANUP_INTERVAL / 1000}s`);
  
  // Validate API connection on startup
  const { GeminiService } = require('./services/geminiService');
  const geminiService = new GeminiService();
  
  geminiService.validateApiConnection()
    .then((connected: boolean) => {
      if (connected) {
        console.log('✅ Gemini API connection validated');
      } else {
        console.log('⚠️  Gemini API connection failed - check API key');
      }
    })
    .catch((error: Error) => {
      console.log('⚠️  Gemini API validation error:', error.message);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
