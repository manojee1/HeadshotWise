import multer from 'multer';
import { Request } from 'express';
import { config } from '../config/environment';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate image types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
    files: 1 // Only allow one file at a time
  }
});

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only one file is allowed.'
      });
    }
  }
  
  if (error.message === 'Invalid file type. Only JPEG and PNG files are allowed.') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
};
