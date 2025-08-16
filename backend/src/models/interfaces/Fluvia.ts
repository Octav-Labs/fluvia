// Database record interface (matches the Fluvia table)
export interface FluviaRecord {
  uuid: string;
  user_uuid: string;
  contract_address?: string;
  label?: string;
  receiver_address?: string;
}

// Object model interface (for business logic)
export interface Fluvia {
  uuid: string;
  userUuid: string;
  contractAddress?: string;
  label?: string;
  receiverAddress?: string;
}
