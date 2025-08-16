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
        limit: "100",
        offset: "0",
        hidespam: "true",
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

  const filteredTransactions = fetchedTransactions.filter((tx) => {
    const matchesSearch =
      tx.functionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChain = selectedChain === "all" || tx.chain.key === selectedChain;

    return matchesSearch && matchesChain;
  }).sort((a, b) => {
    // Sort by timestamp: most recent first
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });

  const getTransactionLabel = (tx: OctavTransaction) => {
    if (tx.functionName) {
      return tx.functionName;
    }
    if (tx.type === "transfer") {
      return "Transfer";
    }
    if (tx.type === "swap") {
      return "Swap";
    }
    if (tx.type === "approve") {
      return "Approve";
    }
    return tx.type || "Transaction";
  };

  const getTransactionStatus = (tx: OctavTransaction) => {
    // You can implement more sophisticated status logic based on your needs
    return "completed"; // Most blockchain transactions are completed once they appear
  };

  const formatValue = (value: string, symbol?: string) => {
    if (!value || value === "0") return "0";
    const numValue = parseFloat(value);
    if (numValue < 0.01) return `< 0.01 ${symbol || ""}`;
    return `${numValue.toFixed(2)} ${symbol || ""}`;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      if (!timestamp) return "Unknown";
      
      console.log('Raw timestamp:', timestamp); // Debug log
      
      // Handle different timestamp formats
      let date: Date;
      
      // Check if it's a Unix timestamp (seconds)
      if (/^\d{10}$/.test(timestamp)) {
        date = new Date(parseInt(timestamp) * 1000);
      }
      // Check if it's a Unix timestamp (milliseconds)
      else if (/^\d{13}$/.test(timestamp)) {
        date = new Date(parseInt(timestamp));
      }
      // Try parsing as ISO string
      else {
        date = new Date(timestamp);
      }
      
      console.log('Parsed date:', date); // Debug log
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected'); // Debug log
        return "Invalid Date";
      }
      
      // Format as relative time if recent, otherwise as date
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        // Show relative time for recent transactions
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor(diffInHours * 60);
          return `${diffInMinutes} min ago`;
        }
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 168) { // 7 days
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        // Show full date for older transactions
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error, 'Timestamp:', timestamp);
      return "Invalid Date";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Copied to clipboard (fallback):', text);
    }
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
                        key={tx.hash}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                            </code>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tx.hash)}
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
                          <div className="space-y-1">
                            {tx.assetsIn.length > 0 && tx.assetsIn[0]?.balance && (
                              <div className="text-sm font-semibold text-green-600">
                                +{formatValue(tx.assetsIn[0].balance, tx.assetsIn[0]?.symbol)}
                              </div>
                            )}
                            {tx.assetsOut.length > 0 && tx.assetsOut[0]?.balance && (
                              <div className="text-sm font-semibold text-red-600">
                                -{formatValue(tx.assetsOut[0].balance, tx.assetsOut[0]?.symbol)}
                              </div>
                            )}
                            {tx.assetsIn.length === 0 && tx.assetsOut.length === 0 && (
                              <span className="text-sm font-semibold text-gray-700">
                                {formatValue(tx.value, "ETH")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(getTransactionStatus(tx))}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{tx.chain.name}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {formatTimestamp(tx.timestamp)}
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
                    {fetchedTransactions.length === 0 
                      ? "No transactions found for this wallet address."
                      : "No transactions found matching your criteria."
                    }
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
                  {fetchedTransactions.length}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {fetchedTransactions.reduce((total, tx) => {
                    const value = parseFloat(tx.valueFiat || "0");
                    return total + value;
                  }, 0).toFixed(2)} USD
                </div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(fetchedTransactions.map(tx => tx.chain.key)).size}
                </div>
                <div className="text-sm text-gray-600">Active Chains</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
