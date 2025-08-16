// Database record interface (matches the Fluvia_Transaction_Assets table)
export interface FluviaTransactionAssetRecord {
  uuid: string;
  transaction_uuid: string;
  balance?: number;
  from?: string;
  to?: string;
  value?: number;
}

// Object model interface (for business logic)
export interface FluviaTransactionAsset {
  uuid: string;
  transactionUuid: string;
  balance?: number;
  from?: string;
  to?: string;
  value?: number;
}
