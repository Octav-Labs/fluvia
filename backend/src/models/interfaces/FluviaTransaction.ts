// Database record interface (matches the Fluvia_Transactions table)
export interface FluviaTransactionRecord {
  uuid: string;
  fluvia_uuid: string;
  user_uuid: string;
  chain_uuid: string;
  block_number?: number;
  fees?: number;
  from?: string;
  gas_price?: number;
  gas_used?: number;
  hash?: string;
  is_error?: number;
  to?: string;
  value?: number;
}

// Object model interface (for business logic)
export interface FluviaTransaction {
  uuid: string;
  fluviaUuid: string;
  userUuid: string;
  chainUuid: string;
  blockNumber?: number;
  fees?: number;
  from?: string;
  gasPrice?: number;
  gasUsed?: number;
  hash?: string;
  isError?: boolean; // Converted to boolean
  to?: string;
  value?: number;
}
