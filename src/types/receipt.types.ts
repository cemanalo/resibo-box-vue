export enum ReceiptProvider {
  GCASH = 'GCASH',
  MAYA = 'MAYA',
  BDO = 'BDO',
  BPI = 'BPI',
  UNIONBANK = 'UNIONBANK',
  OTHER = 'OTHER',
}

export interface ParsedReceipt {
  id: number;
  provider: ReceiptProvider;
  referenceNumber: string;
  amount: number;
  timestamp?: string;
  rawText?: string;
  confidence?: number;
  imageUrl?: string;
  fileName?: string;
}