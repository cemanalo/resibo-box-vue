import Tesseract from 'tesseract.js';

export interface OCRProgressCallback {
  (progress: number): void;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export class TesseractService {
  /**
   * Perform OCR on an image file
   * @param file The image file to process
   * @param onProgress Optional callback for progress updates (0-100)
   * @returns Promise<OCRResult> The extracted text and confidence
   */
  static async recognizeText(
    file: File,
    onProgress?: OCRProgressCallback
  ): Promise<OCRResult> {
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text' && onProgress) {
              onProgress(Math.round(m.progress * 100));
            }
          },
        }
      );

      return {
        text: result.data.text,
        confidence: result.data.confidence,
      };
    } catch (error) {
      throw new Error(
        `OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate if a file is suitable for OCR processing
   * @param file The file to validate
   * @returns boolean True if file is valid for OCR
   */
  static validateFile(file: File): boolean {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  /**
   * Get file size in human readable format
   * @param bytes File size in bytes
   * @returns string Human readable file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}