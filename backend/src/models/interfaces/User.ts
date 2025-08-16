// Database record interface (matches the Users table)
export interface UserRecord {
  uuid: string;
  address: string;
}

// Object model interface (for business logic)
export interface User {
  uuid: string;
  address: string;
}
