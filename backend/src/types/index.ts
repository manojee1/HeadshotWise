export type StyleType = 'corporate' | 'creative' | 'executive';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface ProcessedImage {
  originalPath: string;
  processedPath: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export interface HeadshotRequest {
  imageFile: UploadedFile;
  style: StyleType;
  userId?: string;
}

export interface HeadshotResponse {
  success: boolean;
  data?: {
    originalImage: string;
    generatedImage: string;
    style: StyleType;
    processingTime: number;
  };
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
  error?: string;
}
