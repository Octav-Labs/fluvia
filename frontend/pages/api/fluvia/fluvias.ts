import { NextApiRequest, NextApiResponse } from "next";

interface Fluvia {
  id: string;
  label: string;
  chains: string[];
  contractAddress: string;
  depositAddress: string;
  status: "active" | "inactive" | "pending";
  totalValue: number;
  lastActivity: string;
}

interface CreateFluviaRequest {
  label: string;
  chains: string[];
  contractAddress: string;
  depositAddress: string;
}

// Mock data
const mockFluvias: Fluvia[] = [
  {
    id: "1",
    label: "Treasury Fluvia",
    chains: ["ethereum", "arbitrum", "base"],
    contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    depositAddress: "0x9562cbd309c466cff835126f246be479308df72b",
    status: "active",
    totalValue: 1250000.5,
    lastActivity: "2024-01-15T14:30:25Z",
  },
  {
    id: "2",
    label: "DeFi Operations",
    chains: ["ethereum", "arbitrum"],
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    depositAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    status: "active",
    totalValue: 875000.25,
    lastActivity: "2024-01-14T09:15:10Z",
  },
  {
    id: "3",
    label: "Liquidity Pool",
    chains: ["base", "ethereum"],
    contractAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    depositAddress: "0x4567890abcdef1234567890abcdef1234567890ab",
    status: "inactive",
    totalValue: 0,
    lastActivity: "2024-01-10T16:45:30Z",
  },
  {
    id: "4",
    label: "Staking Protocol",
    chains: ["arbitrum", "base"],
    contractAddress: "0x4567890abcdef1234567890abcdef1234567890ab",
    depositAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    status: "pending",
    totalValue: 250000.75,
    lastActivity: "2024-01-12T11:20:45Z",
  },
  {
    id: "5",
    label: "Yield Farming",
    chains: ["ethereum", "arbitrum", "base"],
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    depositAddress: "0x1234567890abcdef1234567890abcdef12345678",
    status: "active",
    totalValue: 2100000.0,
    lastActivity: "2024-01-15T08:30:15Z",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return mock data
      return res.status(200).json({
        fluvias: mockFluvias,
        total: mockFluvias.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching fluvias:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        label,
        chains,
        contractAddress,
        depositAddress,
      }: CreateFluviaRequest = req.body;

      // Validate required fields
      if (!label || !chains || !contractAddress || !depositAddress) {
        return res.status(400).json({
          error: "Missing required fields",
          details:
            "label, chains, contractAddress, and depositAddress are required",
        });
      }

      // Validate chains
      const validChains = ["ethereum", "arbitrum", "base"];
      const invalidChains = chains.filter(
        (chain) => !validChains.includes(chain)
      );
      if (invalidChains.length > 0) {
        return res.status(400).json({
          error: "Invalid chains",
          details: `Invalid chains: ${invalidChains.join(
            ", "
          )}. Valid chains are: ${validChains.join(", ")}`,
        });
      }

      // Validate Ethereum addresses
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (
        !addressRegex.test(contractAddress) ||
        !addressRegex.test(depositAddress)
      ) {
        return res.status(400).json({
          error: "Invalid addresses",
          details:
            "contractAddress and depositAddress must be valid Ethereum addresses",
        });
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new fluvia
      const newFluvia: Fluvia = {
        id: (mockFluvias.length + 1).toString(),
        label,
        chains,
        contractAddress,
        depositAddress,
        status: "pending",
        totalValue: 0,
        lastActivity: new Date().toISOString(),
      };

      // In a real implementation, you would save to database here
      // mockFluvias.push(newFluvia);

      console.log("Created new fluvia:", newFluvia);

      return res.status(201).json({
        fluvia: newFluvia,
        message: "Fluvia created successfully",
      });
    } catch (error) {
      console.error("Error creating fluvia:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
