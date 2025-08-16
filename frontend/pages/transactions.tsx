import Head from "next/head";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Copy, Filter } from "lucide-react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

// Types for Octav API response
interface OctavTransaction {
  hash: string;
  from: string;
  to: string;
  chain: {
    key: string;
    name: string;
  };
  type: string;
  timestamp: string;
  value: string;
  valueFiat: string;
  fees: string;
  feesFiat: string;
  protocol: {
    name: string;
    key: string;
  };
  assetsIn: Array<{
    name: string;
    symbol: string;
    balance: string;
    value: string;
    price: string;
  }>;
  assetsOut: Array<{
    name: string;
    symbol: string;
    balance: string;
    value: string;
    price: string;
  }>;
  functionName: string;
}

interface TransactionData {
  transactions: OctavTransaction[];
}

// Sample transaction data - replace with real API calls
const sampleTransactions = [
  {
    id: 1,
    label: "USDC Transfer",
    txHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    quantity: "10,000 USDC",
    status: "completed",
    timestamp: "2024-01-15 14:30:25",
    chain: "Ethereum",
  },
  {
    id: 2,
    label: "Cross-chain Bridge",
    txHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    quantity: "5,000 USDC",
    status: "pending",
    timestamp: "2024-01-15 13:15:10",
    chain: "Polygon",
  },
  {
    id: 3,
    label: "Treasury Deposit",
    txHash:
      "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    quantity: "25,000 USDC",
    status: "completed",
    timestamp: "2024-01-15 12:00:00",
    chain: "Arbitrum",
  },
  {
    id: 4,
    label: "Fee Payment",
    txHash:
      "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    to: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
    quantity: "50 USDC",
    status: "completed",
    timestamp: "2024-01-15 11:45:30",
    chain: "Ethereum",
  },
];

export default function TransactionsPage() {
  const { user, authenticated } = usePrivy();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("all");
  const [fetchedTransactions, setFetchedTransactions] = useState<
    OctavTransaction[]
  >([]);

  const fetchTransactions = async () => {
    if (!authenticated || !user?.wallet?.address) {
      console.log("No wallet connected");
      return;
    }

    try {
      const params = new URLSearchParams({
        addresses: user.wallet.address,
        limit: "50",
        offset: "0",
      });

      const response = await fetch(`/api/octav/transactions?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return;
      }

      const data: TransactionData = await response.json();
      setFetchedTransactions(data.transactions || []);
      console.log("Fetched transactions:", data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchTransactions();
    }
  }, [authenticated, user?.wallet?.address]);

  const filteredTransactions = sampleTransactions.filter((tx) => {
    const matchesSearch =
      tx.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChain = selectedChain === "all" || tx.chain === selectedChain;

    return matchesSearch && matchesChain;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>Fluvia Transactions</title>
        <meta name="description" content="View your transaction history" />
      </Head>

      <DashboardLayout>
        <div className="px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Transaction History
            </h1>
            <p className="text-gray-600">
              Monitor all your cross-chain transactions and treasury activities
            </p>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Labels
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Tx Hash
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        From
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        To
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Chain
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {tx.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                            </code>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tx.txHash)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {tx.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{tx.chain}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {tx.timestamp}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No transactions found matching your criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">
                  {sampleTransactions.length}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  40,050 USDC
                </div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Active Chains</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
