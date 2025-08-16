import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create Users table
  await knex.schema.createTable('Users', table => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('privy_user_id').notNullable().unique();
    table.timestamps(true, true);
  });

  // Create Chains table
  await knex.schema.createTable('Chains', table => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('chain_id');
    table.text('explorer_transaction_url');
    table.text('explorer_token_url');
    table.text('name');
    table.text('symbol');
    table.timestamps(true, true);
  });

  // Create Fluvia table
  await knex.schema.createTable('Fluvia', table => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_uuid').notNullable().references('uuid').inTable('Users').onDelete('CASCADE');
    table.text('contract_address');
    table.text('label');
    table.text('receiver_address');
    table.timestamps(true, true);
  });

  // Create Fluvia_Users_Chains junction table
  await knex.schema.createTable('Fluvia_Users_Chains', table => {
    table.uuid('uiud').primary().defaultTo(knex.raw('gen_random_uuid()')); // Note: keeping typo from schema
    table
      .uuid('fluvia_uuid')
      .notNullable()
      .references('uuid')
      .inTable('Fluvia')
      .onDelete('CASCADE');
    table.uuid('user_uuid').notNullable().references('uuid').inTable('Users').onDelete('CASCADE');
    table.uuid('chain_uuid').notNullable().references('uuid').inTable('Chains').onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Create Fluvia_Transactions table
  await knex.schema.createTable('Fluvia_Transactions', table => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('fluvia_uuid')
      .notNullable()
      .references('uuid')
      .inTable('Fluvia')
      .onDelete('CASCADE');
    table.uuid('user_uuid').notNullable().references('uuid').inTable('Users').onDelete('CASCADE');
    table.uuid('chain_uuid').notNullable().references('uuid').inTable('Chains').onDelete('CASCADE');
    table.integer('block_number');
    table.double('fees');
    table.text('from');
    table.double('gas_price');
    table.integer('gas_used');
    table.text('hash');
    table.smallint('is_error');
    table.text('to');
    table.double('value');
    table
      .integer('timestamp')
      .nullable()
      .comment('Unix timestamp when the transaction occurred on the blockchain');
    table.timestamps(true, true);
  });

  // Create Fluvia_Transaction_Assets table
  await knex.schema.createTable('Fluvia_Transaction_Assets', table => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('transaction_uuid')
      .notNullable()
      .references('uuid')
      .inTable('Fluvia_Transactions')
      .onDelete('CASCADE');
    table.double('balance');
    table.text('from');
    table.text('to');
    table.double('value');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order due to foreign key constraints
  await knex.schema.dropTableIfExists('Fluvia_Transaction_Assets');
  await knex.schema.dropTableIfExists('Fluvia_Transactions');
  await knex.schema.dropTableIfExists('Fluvia_Users_Chains');
  await knex.schema.dropTableIfExists('Fluvia');
  await knex.schema.dropTableIfExists('Chains');
  await knex.schema.dropTableIfExists('Users');
}
