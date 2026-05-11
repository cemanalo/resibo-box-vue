import type { ParsedReceipt } from '../types/receipt.types';

export class CSVService {
  /**
   * Export parsed receipts to CSV file (excluding image data)
   * @param receipts Array of parsed receipts to export
   * @param filename Optional custom filename (defaults to timestamped name)
   */
  static exportReceipts(receipts: ParsedReceipt[], filename?: string): void {
    if (receipts.length === 0) {
      alert('No receipts to export');
      return;
    }

    // Filter data to exclude image-related fields
    const csvData = receipts.map(receipt => ({
      provider: receipt.provider,
      referenceNumber: receipt.referenceNumber,
      amount: receipt.amount,
      timestamp: receipt.timestamp || '',
      confidence: receipt.confidence || '',
      rawText: receipt.rawText || ''
    }));

    // Create CSV headers
    const headers = ['Provider', 'Reference Number', 'Amount', 'Timestamp', 'Confidence', 'Raw Text'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => [
        `"${row.provider}"`,
        `"${row.referenceNumber}"`,
        `"${row.amount}"`,
        `"${row.timestamp}"`,
        row.confidence,
        `"${row.rawText.replace(/"/g, '""')}"` // Escape quotes in raw text
      ].join(','))
    ].join('\n');

    // Generate filename if not provided
    const defaultFilename = `receipts_export_${new Date().toISOString().split('T')[0]}.csv`;
    const finalFilename = filename || defaultFilename;

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    URL.revokeObjectURL(url);
    
    console.log('CSV exported successfully:', finalFilename);
  }

  /**
   * Generate CSV content without downloading
   * @param receipts Array of parsed receipts
   * @returns CSV string content
   */
  static generateCSVContent(receipts: ParsedReceipt[]): string {
    if (receipts.length === 0) {
      return '';
    }

    // Filter data to exclude image-related fields
    const csvData = receipts.map(receipt => ({
      provider: receipt.provider,
      referenceNumber: receipt.referenceNumber,
      amount: receipt.amount,
      timestamp: receipt.timestamp || '',
      confidence: receipt.confidence || '',
      rawText: receipt.rawText || ''
    }));

    // Create CSV headers
    const headers = ['Provider', 'Reference Number', 'Amount', 'Timestamp', 'Confidence', 'Raw Text'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => [
        `"${row.provider}"`,
        `"${row.referenceNumber}"`,
        `"${row.amount}"`,
        `"${row.timestamp}"`,
        row.confidence,
        `"${row.rawText.replace(/"/g, '""')}"` // Escape quotes in raw text
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Validate receipts before export
   * @param receipts Array of parsed receipts
   * @returns Validation result with errors if any
   */
  static validateReceiptsForExport(receipts: ParsedReceipt[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (receipts.length === 0) {
      errors.push('No receipts to export');
      return { isValid: false, errors };
    }

    receipts.forEach((receipt, index) => {
      if (!receipt.referenceNumber) {
        errors.push(`Receipt ${index + 1}: Missing reference number`);
      }
      if (!receipt.amount) {
        errors.push(`Receipt ${index + 1}: Missing amount`);
      }
      if (!receipt.provider) {
        errors.push(`Receipt ${index + 1}: Missing provider`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}