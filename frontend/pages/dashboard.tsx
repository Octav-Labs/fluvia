import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Plus,
  CreditCard,
  TrendingUp,
  Globe,
  Activity,
  ArrowRight,
  Wallet,
  Clock,
  DollarSign,
} from "lucide-react";

import TitleBloc from "@/components/bloc/title-bloc";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    fluviaCount: 0,
    transactionCount: 0,
    totalVolume: 0,
    activeChains: 0,
    recentTransactions: [] as Array<{
      hash: string;
      amount: number;
      chain: string;
      time: string;
    }>,
  });
  const router = useRouter();
  const { authenticated, user } = usePrivy();

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      // Simulate fetching user stats
      setStats({
        fluviaCount: 3,
        transactionCount: 24,
        totalVolume: 125000,
        activeChains: 3,
        recentTransactions: [
          {
            hash: "0x123...abc",
            amount: 5000,
            chain: "Ethereum",
            time: "2 min ago",
          },
          {
            hash: "0x456...def",
            amount: 2500,
            chain: "Polygon",
            time: "15 min ago",
          },
          {
            hash: "0x789...ghi",
            amount: 10000,
            chain: "Arbitrum",
            time: "1h ago",
          },
        ],
      });
    }
  }, [authenticated, user?.wallet?.address]);

  return (
    <>
      <Head>
        <title>Fluvia Dashboard</title>
      </Head>

      <DashboardLayout>
        <TitleBloc
          title="Welcome back! 👋"
          description="Manage your Fluvias and monitor your cross-chain treasury
              operations"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Fluvias
                  </p>
                  <p className="text-2xl font-bold">{stats.fluviaCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold">{stats.transactionCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Chains
                  </p>
                  <p className="text-2xl font-bold">{stats.activeChains}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/fluvias")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Create New Fluvia
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Set up a new cross-chain payment address
                </p>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/transactions")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  View Transactions
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor your payment history and analytics
                </p>
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/hiw")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Learn More</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Understand how Fluvia works
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.hash}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.chain}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/transactions")}
                  className="text-primary hover:text-primary/80"
                >
                  View All Transactions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
