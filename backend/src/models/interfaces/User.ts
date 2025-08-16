// Database record interface (matches the Users table)
export interface UserRecord {
  uuid: string;
  privy_user_id: string;
}

// Object model interface (for business logic)
export interface User {
  uuid: string;
  privyUserId: string;
}
