import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddFluviaDialog } from "@/components/add-fluvia-dialog";

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

interface FluviaData {
  fluvias: Fluvia[];
  total: number;
  timestamp: string;
}

export default function FluviasPage() {
  const [fluvias, setFluvias] = useState<Fluvia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  // Define table columns
  const columns: Column<Fluvia>[] = [
    {
      key: "label",
      header: "Label",
      accessor: (fluvia) => (
        <span className="font-medium text-gray-900">{fluvia.label}</span>
      ),
      sortable: true,
    },
    {
      key: "chains",
      header: "Chains",
      accessor: (fluvia) => (
        <div className="flex flex-wrap gap-1">
          {fluvia.chains.map((chain) => (
            <Badge key={chain} variant="outline" className="text-xs">
              {chain}
            </Badge>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      key: "contractAddress",
      header: "Contract Address",
      accessor: (fluvia) => (
        <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {fluvia.contractAddress.slice(0, 8)}...
          {fluvia.contractAddress.slice(-6)}
        </code>
      ),
      sortable: true,
    },
    {
      key: "depositAddress",
      header: "Deposit Address",
      accessor: (fluvia) => (
        <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {fluvia.depositAddress.slice(0, 8)}...
          {fluvia.depositAddress.slice(-6)}
        </code>
      ),
      sortable: true,
    },
  ];

  const fetchFluvias = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fluvia/fluvias");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch fluvias");
      }

      const data: FluviaData = await response.json();
      setFluvias(data.fluvias);
    } catch (err) {
      console.error("Error fetching fluvias:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch fluvias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchFluvias();
    }
  }, [authenticated]);

  return (
    <>
      <Head>
        <title>Fluvia Dashboard</title>
      </Head>

      <DashboardLayout>
        {/* Header */}
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Fluvia Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your fluvias and monitor their performance
              </p>
            </div>
            <AddFluviaDialog onFluviaAdded={fetchFluvias} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Fluvias Table */}
        <DataTable
          data={fluvias}
          columns={columns}
          title="Your Fluvias"
          searchable={true}
          searchPlaceholder="Search fluvias by label, addresses..."
          searchKeys={["label", "contractAddress", "depositAddress"]}
          sortable={true}
          pagination={true}
          pageSize={10}
          loading={loading}
          emptyMessage="No fluvias found. Create your first fluvia to get started."
          actions={{
            copy: (fluvia) => fluvia.contractAddress,
            external: (fluvia) =>
              `https://etherscan.io/address/${fluvia.contractAddress}`,
          }}
        />
      </DashboardLayout>
    </>
  );
}
