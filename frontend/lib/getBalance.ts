import { ethers } from "ethers";

const CURRENT_CHAINS = [84532, 11155111, 421614];

/**
 * Get RPC URL for the given chain
 */
const getRpcUrl = (chainId: number): string => {
  switch (chainId) {
    case 84532: // Base Sepolia
      return "https://sepolia.base.org";
    case 8453: // Base Mainnet
      return "https://base.llamarpc.com";
    case 11155111: // Ethereum Sepolia
      return "https://sepolia.drpc.org";
    case 1: // Ethereum Mainnet
      return "https://eth.llamarpc.com";
    case 421614: // Arbitrum Sepolia
      return "https://api.zan.top/arb-sepolia";
    case 42161: // Arbitrum Mainnet
      return "https://arbitrum.drpc.org";
    default:
      return "";
  }
};

const usdcAbi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
];

const usdcContracts = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // base mainnet
  11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Ethereum Sepolia
  1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", //   Ethereum Mainnet
  421614: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // Arbitrum Sepolia
  42161: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // Arbitrum mainnet
};

/**
 * Get USDC balance and contract address for a given chain and wallet address
 * @param chainId - The chain ID
 * @param address - The wallet address to check balance for
 * @returns Object containing balance and USDC contract address
 */
const getUSDCBalance = async (chainId: number, address: string) => {
  const rpcUrl = getRpcUrl(chainId);
  const usdcAddress = usdcContracts[chainId];

  if (!rpcUrl) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  if (!usdcAddress) {
    throw new Error(`USDC contract not found for chain ID: ${chainId}`);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const client = new ethers.Contract(usdcAddress, usdcAbi, provider);
  if (!client.balanceOf) {
    throw new Error("balanceOf function not found");
  }
  const balance = await client.balanceOf(address);
  const balanceInUsdc = BigInt(balance) / BigInt(10 ** 6);

  return {
    balance: balanceInUsdc,
    usdcAddress,
    chainId,
  };
};

const getTotalBalanceOfUSDC = async (addresses: string[]): Promise<number> => {
  let balance = BigInt(0);

  for (const address of addresses) {
    const balances = await Promise.all(
      CURRENT_CHAINS.map((chainId) => getUSDCBalance(chainId, address))
    );

    balance += balances.reduce((acc, curr) => acc + curr.balance, BigInt(0));
  }

  return Number(balance);
};

/**
 * Get USDC balance for a given chain and wallet address
 * @param chainId - The chain ID
 * @param address - The wallet address to check balance for
 * @returns USDC balance as BigInt
 */
const getBalance = async (chainId: number, address: string) => {
  const { balance } = await getUSDCBalance(chainId, address);
  return balance;
};

export { getBalance, getUSDCBalance, getTotalBalanceOfUSDC, usdcContracts };
