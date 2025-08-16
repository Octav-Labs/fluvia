import Head from "next/head";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
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
  const [selectedChain, setSelectedChain] = useState("all");
  const [fetchedTransactions, setFetchedTransactions] = useState<
    OctavTransaction[]
  >([]);

  // Define table columns
  const columns: Column<OctavTransaction>[] = [
    {
      key: "hash",
      header: "Tx Hash",
      accessor: (tx) => (
        <code className="text-xs font-mono text-muted-foreground bg-card/50 px-2 py-1 rounded">
          {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
        </code>
      ),
      sortable: true,
    },
    {
      key: "from",
      header: "From",
      accessor: (tx) => (
        <code className="text-xs font-mono text-muted-foreground bg-card/50 px-2 py-1 rounded">
          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
        </code>
      ),
      sortable: true,
    },
    {
      key: "to",
      header: "To",
      accessor: (tx) => (
        <code className="text-xs font-mono text-muted-foreground bg-card/50 px-2 py-1 rounded">
          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
        </code>
      ),
      sortable: true,
    },
    {
      key: "quantity",
      header: "Quantity",
      accessor: (tx) => (
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
      ),
      sortable: false,
    },
    {
      key: "status",
      header: "Status",
      accessor: (tx) => getStatusBadge(getTransactionStatus(tx)),
      sortable: true,
    },
    {
      key: "chain",
      header: "Chain",
      accessor: (tx) => <Badge variant="outline">{tx.chain.name}</Badge>,
      sortable: true,
    },
    {
      key: "timestamp",
      header: "Time",
      accessor: (tx) => (
        <span className="text-sm text-gray-600">
          {formatTimestamp(tx.timestamp)}
        </span>
      ),
      sortable: true,
    },
  ];

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
        hideSpam: "true",
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

  // Filter transactions by chain
  const filteredTransactions = fetchedTransactions.filter((tx) => {
    return selectedChain === "all" || tx.chain.key === selectedChain;
  });

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

      console.log("Raw timestamp:", timestamp); // Debug log

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

      console.log("Parsed date:", date); // Debug log

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.log("Invalid date detected"); // Debug log
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
      } else if (diffInHours < 168) {
        // 7 days
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        // Show full date for older transactions
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      console.error(
        "Error formatting timestamp:",
        error,
        "Timestamp:",
        timestamp
      );
      return "Invalid Date";
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
        {/* Header */}
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <h1 className="text-3xl font-bold text-foreground">
            Transaction History
          </h1>
          <p className="text-gray-600">
            Monitor all your cross-chain transactions and treasury activities
          </p>
        </div>

        {/* Transactions Table */}
        <DataTable
          data={filteredTransactions}
          columns={columns}
          title="Recent Transactions"
          searchable={true}
          searchPlaceholder="Search transactions, addresses..."
          searchKeys={["hash", "from", "to", "functionName"]}
          sortable={true}
          pagination={true}
          pageSize={10}
          loading={false}
          emptyMessage={
            fetchedTransactions.length === 0
              ? "No transactions found for this wallet address."
              : "No transactions found matching your criteria."
          }
          actions={{
            copy: (tx) => tx.hash,
            external: (tx) => {
              const chainKey = tx.chain.key;
              const hash = tx.hash;

              switch (chainKey) {
                case "ethereum":
                  return `https://etherscan.io/tx/${hash}`;
                case "base":
                  return `https://basescan.org/tx/${hash}`;
                case "polygon":
                  return `https://polygonscan.com/tx/${hash}`;
                case "arbitrum":
                  return `https://arbiscan.io/tx/${hash}`;
                default:
                  return `https://etherscan.io/tx/${hash}`;
              }
            },
          }}
        />

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
                {fetchedTransactions
                  .reduce((total, tx) => {
                    const value = parseFloat(tx.valueFiat || "0");
                    return total + value;
                  }, 0)
                  .toFixed(2)}{" "}
                USD
              </div>
              <div className="text-sm text-gray-600">Total Volume</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(fetchedTransactions.map((tx) => tx.chain.key)).size}
              </div>
              <div className="text-sm text-gray-600">Active Chains</div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
