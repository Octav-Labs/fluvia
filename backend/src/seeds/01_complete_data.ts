import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Check if data already exists
  const existingUsers = await knex('Users').count('* as count').first();
  if (existingUsers && parseInt(existingUsers.count as string) > 0) {
    console.log('Data already exists, skipping...');
    return;
  }

  // Insert sample users
  const users = await knex('Users')
    .insert([
      {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      },
      {
        address: '0x1234567890123456789012345678901234567890',
      },
    ])
    .returning('uuid');

  // Insert sample chains
  const chains = await knex('Chains')
    .insert([
      {
        chain_id: 1,
        name: 'Ethereum Mainnet',
        symbol: 'ETH',
        explorer_transaction_url: 'https://etherscan.io/tx/',
        explorer_token_url: 'https://etherscan.io/token/',
      },
      {
        chain_id: 137,
        name: 'Polygon',
        symbol: 'MATIC',
        explorer_transaction_url: 'https://polygonscan.com/tx/',
        explorer_token_url: 'https://polygonscan.com/token/',
      },
    ])
    .returning('uuid');

  // Insert sample fluvia
  const fluvia = await knex('Fluvia')
    .insert([
      {
        user_uuid: users[0].uuid,
        contract_address: '0x1234567890123456789012345678901234567890',
        label: 'Sample Fluvia Contract',
        receiver_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      },
    ])
    .returning('uuid');

  // Insert fluvia users chains relationships
  await knex('Fluvia_Users_Chains').insert([
    {
      fluvia_uuid: fluvia[0].uuid,
      user_uuid: users[0].uuid,
      chain_uuid: chains[0].uuid,
    },
    {
      fluvia_uuid: fluvia[0].uuid,
      user_uuid: users[0].uuid,
      chain_uuid: chains[1].uuid,
    },
  ]);

  // Insert sample transactions with timestamps
  const sampleTransactions = [
    {
      fluvia_uuid: fluvia[0].uuid,
      user_uuid: users[0].uuid,
      chain_uuid: chains[0].uuid,
      block_number: 12345678,
      fees: 0.001,
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      gas_price: 20000000000,
      gas_used: 21000,
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      is_error: 0,
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: 0.1,
      timestamp: Math.floor(new Date('2024-01-15T10:30:00Z').getTime() / 1000),
    },
    {
      fluvia_uuid: fluvia[0].uuid,
      user_uuid: users[0].uuid,
      chain_uuid: chains[0].uuid,
      block_number: 12345679,
      fees: 0.002,
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      gas_price: 25000000000,
      gas_used: 50000,
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      is_error: 0,
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: 0.5,
      timestamp: Math.floor(new Date('2024-01-15T14:45:00Z').getTime() / 1000),
    },
    {
      fluvia_uuid: fluvia[0].uuid,
      user_uuid: users[0].uuid,
      chain_uuid: chains[0].uuid,
      block_number: 12345680,
      fees: 0.0015,
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      gas_price: 22000000000,
      gas_used: 30000,
      hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      is_error: 1,
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      value: 0.2,
      timestamp: Math.floor(new Date('2024-01-15T16:20:00Z').getTime() / 1000),
    },
  ];

  // Insert sample transactions and get their UUIDs
  const insertedTransactions = await knex('Fluvia_Transactions')
    .insert(sampleTransactions)
    .returning('uuid');

  // Insert sample transaction assets
  const sampleAssets = [
    {
      transaction_uuid: insertedTransactions[0].uuid,
      balance: 100.0,
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x1234567890123456789012345678901234567890',
      value: 0.1,
    },
    {
      transaction_uuid: insertedTransactions[1].uuid,
      balance: 99.5,
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x1234567890123456789012345678901234567890',
      value: 0.5,
    },
  ];

  await knex('Fluvia_Transaction_Assets').insert(sampleAssets);

  console.log('Inserted complete dataset: users, chains, fluvia, transactions, and assets');
}

export async function rollback(knex: Knex): Promise<void> {
  // Remove all data in reverse order
  await knex('Fluvia_Transaction_Assets').del();
  await knex('Fluvia_Transactions').del();
  await knex('Fluvia_Users_Chains').del();
  await knex('Fluvia').del();
  await knex('Chains').del();
  await knex('Users').del();
}
