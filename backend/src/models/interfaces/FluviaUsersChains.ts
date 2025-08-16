// Database record interface (matches the Fluvia_Users_Chains table)
export interface FluviaUsersChainsRecord {
  uiud: string; // Note: keeping the typo from the schema
  fluvia_uuid: string;
  user_uuid: string;
  chain_uuid: string;
}

// Object model interface (for business logic)
export interface FluviaUsersChains {
  uuid: string; // Corrected spelling
  fluviaUuid: string;
  userUuid: string;
  chainUuid: string;
}
