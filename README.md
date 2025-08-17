# Fluvia

Seamless USDC treasury management across chains

## Overview

Fluvia is a cross-chain DeFi platform that enables seamless USDC treasury management across multiple blockchain networks. The platform provides users with the ability to manage, transfer, and optimize their USDC holdings across different chains through a unified interface.

## Features

- **Cross-Chain USDC Management**: Manage USDC across multiple blockchain networks
- **Smart Contract Infrastructure**: Secure and audited smart contracts for treasury operations
- **Web3 Integration**: Built with Privy for seamless wallet authentication
- **Real-time Transaction Tracking**: Monitor cross-chain transfers and operations
- **Multi-Chain Support**: Currently supports Arbitrum, Base, and Ethereum mainnet

## Architecture

The project consists of three main components:

### Smart Contracts (`/contracts`)
- **FluviaFactory**: Main factory contract for creating and managing Fluvia instances
- **FeeController**: Manages fee structures and calculations
- **Receiver**: Handles incoming cross-chain transactions
- Built with Solidity 0.8.28 and Hardhat framework

### Backend (`/backend`)
- **Node.js/TypeScript API**: RESTful backend services
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: Privy integration for Web3 authentication
- **Chain Management**: Multi-chain integration and transaction handling

### Frontend (`/frontend`)
- **Next.js Application**: Modern React-based web interface
- **Tailwind CSS**: Styled with utility-first CSS framework
- **Web3 Integration**: Wallet connection and blockchain interaction
- **Responsive Design**: Mobile-first approach with modern UI components

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm or npm
- PostgreSQL database
- Hardhat (for smart contract development)

### Backend Setup
```bash
cd backend
pnpm install
cp env.example .env
# Configure your environment variables
pnpm run migrate
pnpm run seed
pnpm run dev
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### Smart Contracts Setup
```bash
cd contracts
pnpm install
npx hardhat compile
npx hardhat test
```

## Environment Configuration

### Backend Environment Variables
Copy the example environment file and configure it with your values:
```bash
cd backend
cp env.example .env
# Edit .env with your actual configuration values
```

### Frontend Environment Variables
Copy the example environment file and configure it with your values:
```bash
cd frontend
cp .env.example .env
# Edit .env with your actual configuration values
```

**Note**: Always refer to the `env.example` files in each directory for the complete list of required environment variables and their expected formats.

## Project Structure

```
fluvia/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── models/         # Database models and interfaces
│   │   ├── services/       # Business logic services
│   │   └── middleware/     # Authentication and validation
│   ├── migrations/         # Database schema migrations
│   └── seeds/              # Database seed data
├── contracts/               # Smart contract source code
│   ├── contracts/          # Solidity contracts
│   ├── test/               # Contract test files
│   └── ignition/           # Deployment configurations
└── frontend/                # Next.js web application
    ├── components/          # React components
    ├── pages/               # Next.js pages
    ├── hooks/               # Custom React hooks
    └── lib/                 # Utility functions and configurations
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
pnpm test

# Smart contract tests
cd contracts
npx hardhat test

# Frontend tests
cd frontend
pnpm test
```

### Database Migrations
```bash
cd backend
pnpm run migrate:make migration_name
pnpm run migrate
pnpm run seed
```

### Smart Contract Deployment
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network <network_name>
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in each component directory
- Review the deployment configurations in the contracts/ignition directory

## Roadmap

- [ ] Additional chain support
- [ ] Enhanced fee optimization algorithms
- [ ] Mobile application
- [ ] Advanced analytics dashboard

