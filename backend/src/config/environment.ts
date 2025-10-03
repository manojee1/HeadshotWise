export const config = {
  // Google Gemini API Configuration
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  
  // Server Configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // File Upload Configuration
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_DIR: './uploads',
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 10,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'],
  
  // Image Processing
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
  OUTPUT_QUALITY: 90,
  OUTPUT_FORMAT: 'jpeg' as const
};
