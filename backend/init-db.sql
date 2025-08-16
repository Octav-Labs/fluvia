-- Initialize Fluvia databases
-- This script runs when the PostgreSQL container starts for the first time

-- Create the test database
CREATE DATABASE fluvia_test;

-- Grant privileges to the fluvia_user on both databases
GRANT ALL PRIVILEGES ON DATABASE fluvia TO fluvia_user;
GRANT ALL PRIVILEGES ON DATABASE fluvia_test TO fluvia_user;

-- Connect to the test database to set up schemas
\c fluvia_test;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fluvia_user;

-- Connect back to main database
\c fluvia;

-- Grant schema privileges on main database
GRANT ALL ON SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fluvia_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fluvia_user;
