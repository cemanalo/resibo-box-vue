import type { ParsedReceipt } from '../types/receipt.types';
import { ReceiptProvider } from '../types/receipt.types';

export interface ParseResult {
  success: boolean;
  receipt?: ParsedReceipt;
  error?: string;
}

export class ReceiptParserService {
  /**
   * Parse OCR raw text into structured receipt data
   * @param rawText The raw OCR text from the receipt
   * @param confidence OCR confidence score (optional)
   * @returns ParseResult with parsed receipt or error
   */
  static parseReceipt(rawText: string, confidence?: number): ParseResult {
    try {
      // Clean and normalize the text
      const cleanText = this.cleanText(rawText);
      
      // Try to identify the provider first
      const provider = this.identifyProvider(cleanText);
      
      if (provider === ReceiptProvider.GCASH) {
        return this.parseGCashReceipt(cleanText, confidence);
      }
      
      return {
        success: false,
        error: `Unsupported receipt provider: ${provider}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Clean and normalize OCR text
   */
  private static cleanText(text: string): string {
    return text
      .replace(/[^\w\s\.,\-\:\$\£\₱]/g, '') // Remove weird characters but keep important symbols
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Identify the receipt provider from text
   */
  private static identifyProvider(text: string): ReceiptProvider {
    const upperText = text.toUpperCase();
    
    if (upperText.includes('GCASH')) {
      return ReceiptProvider.GCASH;
    }
    
    // Add more providers later
    return ReceiptProvider.OTHER;
  }

  /**
   * Parse GCash receipt
   */
  private static parseGCashReceipt(text: string, confidence?: number): ParseResult {
    try {
      const referenceNumber = this.extractReferenceNumber(text);
      const amount: number | null = this.extractAmount(text);
      const timestamp = this.extractTimestamp(text);
      
      if (!referenceNumber || !amount) {
        return {
          success: false,
          error: 'Missing required fields: reference number or amount'
        };
      }

      const receipt: ParsedReceipt = {
        id: Date.now(),
        provider: ReceiptProvider.GCASH,
        referenceNumber,
        amount,
        timestamp: timestamp || undefined,
        rawText: text,
        confidence
      };

      return {
        success: true,
        receipt
      };
    } catch (error) {
      return {
        success: false,
        error: `GCash parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract reference number from GCash receipt
   */
  private static extractReferenceNumber(text: string): string | null {
    // Pattern: Ref No. 4040 554 265594
    const refPattern = /(?:Ref\s*No\.?|Reference\s*No\.?)\s*([\d\s]+)/i;
    const match = text.match(refPattern);
    
    if (match) {
      return match[1].replace(/\s+/g, '').trim();
    }

    // Alternative pattern: Just look for long number sequences
    const numberPattern = /\b(\d{10,})\b/;
    const numberMatch = text.match(numberPattern);
    
    return numberMatch ? numberMatch[1] : null;
  }

  /**
   * Extract amount from GCash receipt
   */
  private static extractAmount(text: string): number | null {
    // Pattern: Amount 300.00 or Total Amount Sent P 300.00
    const amountPatterns = [
      /(?:Amount|Total\s*Amount\s*Sent)[\s\$£₱]*([\d,]+\.\d{2})/i,
      /[\$£₱]\s*([\d,]+\.\d{2})/,
      /(\d{1,3}(?:,\d{3})*\.\d{2})/
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Remove commas and convert to number
        const amountStr = match[1].replace(/,/g, '');
        return parseFloat(amountStr);
      }
    }

    return null;
  }

  /**
   * Extract timestamp from GCash receipt
   */
  private static extractTimestamp(text: string): string | null {
    // Pattern: May 07, 2026 1:51 PM or Jan 9, 2026 8:41 AM
    const timestampPattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s*\d{4}\s+\d{1,2}:\d{2}\s*(?:AM|PM)/i;
    const match = text.match(timestampPattern);
    
    return match ? match[0] : null;
  }

  /**
   * Validate parsed receipt data
   */
  static validateReceipt(receipt: ParsedReceipt): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!receipt.referenceNumber || receipt.referenceNumber.length < 6) {
      errors.push('Invalid reference number');
    }

    if (!receipt.amount || receipt.amount <= 0) {
      errors.push('Invalid amount');
    }

    if (!receipt.provider) {
      errors.push('Missing provider');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}