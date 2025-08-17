import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

import { AddFluviaDialog } from "@/components/add-fluvia-dialog";
import TitleBloc from "@/components/bloc/title-bloc";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Fluvia {
  id: string;
  label: string;
  chains: string[];
  contractAddress: string;
  receiverAddress: string;
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
        <span className="font-medium text-sm text-foreground">
          {fluvia.label}
        </span>
      ),
      sortable: true,
    },
    {
      key: "chains",
      header: "Chains",
      accessor: (fluvia) => (
        <div className="flex flex-wrap gap-1">
          {["Base", "Ethereum", "Arbitrum"].map((chain) => (
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
      header: "Deposit Address",
      accessor: (fluvia) => (
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono text-muted-foreground bg-card/50 px-2 py-1 rounded">
            {fluvia.contractAddress.slice(0, 8)}...
            {fluvia.contractAddress.slice(-6)}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(fluvia.contractAddress);
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      ),
      sortable: true,
    },
    {
      key: "receiverAddress",
      header: "Receiver Address",
      accessor: (fluvia) => (
        <code className="text-xs font-mono text-muted-foreground bg-card/50 px-2 py-1 rounded">
          {fluvia.receiverAddress.slice(0, 8)}...
          {fluvia.receiverAddress.slice(-6)}
        </code>
      ),
      sortable: true,
    },
  ];

  const fetchFluvias = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fluvias/all");

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

        <TitleBloc
          title="Fluvia Dashboard"
          description="Manage your fluvias and monitor their performance"
        />
        <div className="flex justify-end mb-4">
          <AddFluviaDialog onFluviaAdded={fetchFluvias} />
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
          searchKeys={["label", "contractAddress", "receiverAddress"]}
          sortable={true}
          pagination={true}
          pageSize={10}
          loading={loading}
          emptyMessage="No fluvias found. Create your first fluvia to get started."
        />
      </DashboardLayout>
    </>
  );
}
