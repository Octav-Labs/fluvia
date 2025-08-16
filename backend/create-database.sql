-- Fluvia Database Creation Script
-- This script creates the complete database schema for the Fluvia application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    privy_user_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Chains table
CREATE TABLE IF NOT EXISTS "Chains" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id INTEGER,
    explorer_transaction_url TEXT,
    explorer_token_url TEXT,
    name TEXT,
    symbol TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia table
CREATE TABLE IF NOT EXISTS "Fluvia" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    contract_address TEXT,
    label TEXT,
    receiver_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Users_Chains junction table
CREATE TABLE IF NOT EXISTS "Fluvia_Users_Chains" (
    uiud UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Note: keeping typo from schema
    fluvia_uuid UUID NOT NULL REFERENCES "Fluvia"(uuid) ON DELETE CASCADE,
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    chain_uuid UUID NOT NULL REFERENCES "Chains"(uuid) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Transactions table
CREATE TABLE IF NOT EXISTS "Fluvia_Transactions" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fluvia_uuid UUID NOT NULL REFERENCES "Fluvia"(uuid) ON DELETE CASCADE,
    user_uuid UUID NOT NULL REFERENCES "Users"(uuid) ON DELETE CASCADE,
    chain_uuid UUID NOT NULL REFERENCES "Chains"(uuid) ON DELETE CASCADE,
    block_number INTEGER,
    fees DOUBLE PRECISION,
    "from" TEXT,
    gas_price DOUBLE PRECISION,
    gas_used INTEGER,
    hash TEXT,
    is_error SMALLINT,
    "to" TEXT,
    value DOUBLE PRECISION,
    "timestamp" INTEGER COMMENT 'Unix timestamp when the transaction occurred on the blockchain',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Fluvia_Transaction_Assets table
CREATE TABLE IF NOT EXISTS "Fluvia_Transaction_Assets" (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_uuid UUID NOT NULL REFERENCES "Fluvia_Transactions"(uuid) ON DELETE CASCADE,
    balance DOUBLE PRECISION,
    "from" TEXT,
    "to" TEXT,
    value DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_privy_user_id ON "Users"(privy_user_id);
CREATE INDEX IF NOT EXISTS idx_fluvia_user_uuid ON "Fluvia"(user_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_users_chains_fluvia_uuid ON "Fluvia_Users_Chains"(fluvia_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_users_chains_user_uuid ON "Fluvia_Users_Chains"(user_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_users_chains_chain_uuid ON "Fluvia_Users_Chains"(chain_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_transactions_fluvia_uuid ON "Fluvia_Transactions"(fluvia_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_transactions_user_uuid ON "Fluvia_Transactions"(user_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_transactions_chain_uuid ON "Fluvia_Transactions"(chain_uuid);
CREATE INDEX IF NOT EXISTS idx_fluvia_transactions_hash ON "Fluvia_Transactions"(hash);
CREATE INDEX IF NOT EXISTS idx_fluvia_transaction_assets_transaction_uuid ON "Fluvia_Transaction_Assets"(transaction_uuid);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chains_updated_at BEFORE UPDATE ON "Chains"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fluvia_updated_at BEFORE UPDATE ON "Fluvia"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fluvia_users_chains_updated_at BEFORE UPDATE ON "Fluvia_Users_Chains"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fluvia_transactions_updated_at BEFORE UPDATE ON "Fluvia_Transactions"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fluvia_transaction_assets_updated_at BEFORE UPDATE ON "Fluvia_Transaction_Assets"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default chain data
INSERT INTO "Chains" (chain_id, name, symbol, explorer_transaction_url, explorer_token_url) VALUES
    (1, 'Ethereum Mainnet', 'ETH', 'https://etherscan.io/tx/', 'https://etherscan.io/token/'),
    (137, 'Polygon', 'MATIC', 'https://polygonscan.com/tx/', 'https://polygonscan.com/token/'),
    (42161, 'Arbitrum One', 'ARB', 'https://arbiscan.io/tx/', 'https://arbiscan.io/token/'),
    (8453, 'Base', 'ETH', 'https://basescan.org/tx/', 'https://basescan.org/token/'),
    (84532, 'Base Sepolia', 'ETH', 'https://sepolia.basescan.org/tx/', 'https://sepolia.basescan.org/token/'),
    (11155111, 'Sepolia', 'ETH', 'https://sepolia.etherscan.io/tx/', 'https://sepolia.etherscan.io/token/')
ON CONFLICT (chain_id) DO NOTHING;

-- Grant permissions to fluvia_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fluvia_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO fluvia_user;

-- Create a view for easier querying of fluvia data with user and chain information
CREATE OR REPLACE VIEW fluvia_with_details AS
SELECT
    f.uuid,
    f.contract_address,
    f.label,
    f.receiver_address,
    u.privy_user_id,
    c.name as chain_name,
    c.symbol as chain_symbol,
    c.chain_id,
    f.created_at,
    f.updated_at
FROM "Fluvia" f
JOIN "Users" u ON f.user_uuid = u.uuid
JOIN "Fluvia_Users_Chains" fuc ON f.uuid = fuc.fluvia_uuid
JOIN "Chains" c ON fuc.chain_uuid = c.uuid;

-- Grant permissions on the view
GRANT SELECT ON fluvia_with_details TO fluvia_user;

-- Display table creation confirmation
DO $$
BEGIN
    RAISE NOTICE 'Fluvia database schema created successfully!';
    RAISE NOTICE 'Tables created: Users, Chains, Fluvia, Fluvia_Users_Chains, Fluvia_Transactions, Fluvia_Transaction_Assets';
    RAISE NOTICE 'Default chains inserted: Ethereum, Polygon, Arbitrum, Base, Base Sepolia, Sepolia';
    RAISE NOTICE 'Indexes and triggers created for optimal performance';
END $$;
