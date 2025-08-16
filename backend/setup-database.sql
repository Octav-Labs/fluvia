-- Fluvia Database Setup Script
-- Run this script to set up the complete database schema

-- Connect to the fluvia database (run this manually if needed)
-- \c fluvia;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS "Fluvia_Transaction_Assets" CASCADE;
DROP TABLE IF EXISTS "Fluvia_Transactions" CASCADE;
DROP TABLE IF EXISTS "Fluvia_Users_Chains" CASCADE;
DROP TABLE IF EXISTS "Fluvia" CASCADE;
DROP TABLE IF EXISTS "Chains" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Create Users table
CREATE TABLE "Users" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    privy_user_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Chains table
CREATE TABLE "Chains" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id INTEGER UNIQUE,
    explorer_transaction_url TEXT,
    explorer_token_url TEXT,
    name TEXT,
    symbol TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia table
CREATE TABLE "Fluvia" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    contract_address TEXT,
    label TEXT,
    receiver_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Users_Chains junction table
CREATE TABLE "Fluvia_Users_Chains" (
    uiud UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fluvia_uuid UUID NOT NULL REFERENCES "Fluvia"(uuid) ON DELETE CASCADE,
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    chain_uuid UUID NOT NULL REFERENCES "Chains"(uuid) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Transactions table
CREATE TABLE "Fluvia_Transactions" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fluvia_uuid UUID NOT NULL REFERENCES "Fluvia"(uuid) ON DELETE CASCADE,
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    chain_uuid UUID NOT NULL REFERENCES "Chains"(uuid) ON DELETE CASCADE,
    block_number INTEGER,
    fees DOUBLE PRECISION,
    "from" TEXT,
    gas_price DOUBLE PRECISION,
    gas_used INTEGER,
    hash TEXT UNIQUE,
    is_error SMALLINT,
    "to" TEXT,
    value DOUBLE PRECISION,
    "timestamp" INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Transaction_Assets table
CREATE TABLE "Fluvia_Transaction_Assets" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_uuid UUID NOT NULL REFERENCES "Fluvia_Transactions"(uuid) ON DELETE CASCADE,
    balance DOUBLE PRECISION,
    "from" TEXT,
    "to" TEXT,
    value DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_privy_user_id ON "Users"(privy_user_id);
CREATE INDEX idx_fluvia_user_uuid ON "Fluvia"(user_uuid);
CREATE INDEX idx_fluvia_users_chains_fluvia_uuid ON "Fluvia_Users_Chains"(fluvia_uuid);
CREATE INDEX idx_fluvia_users_chains_user_uuid ON "Fluvia_Users_Chains"(user_uuid);
CREATE INDEX idx_fluvia_users_chains_chain_uuid ON "Fluvia_Users_Chains"(chain_uuid);
CREATE INDEX idx_fluvia_transactions_fluvia_uuid ON "Fluvia_Transactions"(fluvia_uuid);
CREATE INDEX idx_fluvia_transactions_user_uuid ON "Fluvia_Transactions"(user_uuid);
CREATE INDEX idx_fluvia_transactions_chain_uuid ON "Fluvia_Transactions"(chain_uuid);
CREATE INDEX idx_fluvia_transactions_hash ON "Fluvia_Transactions"(hash);
CREATE INDEX idx_fluvia_transaction_assets_transaction_uuid ON "Fluvia_Transaction_Assets"(transaction_uuid);

-- Insert default chains
INSERT INTO "Chains" (chain_id, name, symbol, explorer_transaction_url, explorer_token_url) VALUES
    (1, 'Ethereum Mainnet', 'ETH', 'https://etherscan.io/tx/', 'https://etherscan.io/token/'),
    (137, 'Polygon', 'MATIC', 'https://polygonscan.com/tx/', 'https://polygonscan.com/token/'),
    (42161, 'Arbitrum One', 'ARB', 'https://arbiscan.io/tx/', 'https://arbiscan.io/token/'),
    (8453, 'Base', 'ETH', 'https://basescan.org/tx/', 'https://basescan.org/token/'),
    (84532, 'Base Sepolia', 'ETH', 'https://sepolia.basescan.org/tx/', 'https://sepolia.basescan.org/token/'),
    (11155111, 'Sepolia', 'ETH', 'https://sepolia.etherscan.io/tx/', 'https://sepolia.etherscan.io/token/');

-- Grant permissions to fluvia_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fluvia_user;

-- Success message
SELECT 'Database setup completed successfully!' as status;
