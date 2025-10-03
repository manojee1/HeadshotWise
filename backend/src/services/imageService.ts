import sharp from 'sharp';
import { config } from '../config/environment';
import { UploadedFile, ProcessedImage } from '../types';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ImageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.UPLOAD_DIR;
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async processUploadedImage(file: UploadedFile): Promise<ProcessedImage> {
    try {
      const fileId = uuidv4();
      const originalPath = path.join(this.uploadDir, `${fileId}_original.${this.getFileExtension(file.mimetype)}`);
      const processedPath = path.join(this.uploadDir, `${fileId}_processed.jpg`);

      // Save original file
      await fs.writeFile(originalPath, file.buffer);

      // Process image with Sharp
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Validate dimensions
      if (metadata.width && metadata.height) {
        if (metadata.width < 512 || metadata.height < 512) {
          throw new Error('Image must be at least 512x512 pixels');
        }
      }

      // Process and optimize image
      const processedBuffer = await image
        .resize(config.MAX_WIDTH, config.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: config.OUTPUT_QUALITY,
          progressive: true
        })
        .toBuffer();

      // Save processed image
      await fs.writeFile(processedPath, processedBuffer);

      const processedMetadata = await sharp(processedBuffer).metadata();

      return {
        originalPath,
        processedPath,
        width: processedMetadata.width || 0,
        height: processedMetadata.height || 0,
        size: processedBuffer.length,
        format: 'jpeg'
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveGeneratedImage(imageBuffer: Buffer, style: string): Promise<string> {
    try {
      const fileId = uuidv4();
      const filename = `${fileId}_${style}_generated.jpg`;
      const filepath = path.join(this.uploadDir, filename);

      await fs.writeFile(filepath, imageBuffer);
      return filepath;
    } catch (error) {
      console.error('Error saving generated image:', error);
      throw new Error(`Failed to save generated image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getImageAsBase64(filepath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filepath);
      return buffer.toString('base64');
    } catch (error) {
      console.error('Error reading image:', error);
      throw new Error(`Failed to read image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cleanupFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error cleaning up file:', error);
      // Don't throw error for cleanup failures
    }
  }

  async cleanupOldFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const now = Date.now();
      const maxAge = config.CLEANUP_INTERVAL;

      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await this.cleanupFile(filepath);
          console.log(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  private getFileExtension(mimetype: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    return extensions[mimetype] || 'jpg';
  }

  validateFile(file: UploadedFile): void {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
    }

    // Check file size
    if (file.size > config.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${config.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  }
}
