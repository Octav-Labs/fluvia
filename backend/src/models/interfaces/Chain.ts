// Database record interface (matches the Chains table)
export interface ChainRecord {
  uuid: string;
  chain_id?: number;
  explorer_transaction_url?: string;
  explorer_token_url?: string;
  name?: string;
  symbol?: string;
}

// Object model interface (for business logic)
export interface Chain {
  uuid: string;
  chainId?: number;
  explorerTransactionUrl?: string;
  explorerTokenUrl?: string;
  name?: string;
  symbol?: string;
}
