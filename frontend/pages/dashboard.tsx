import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Plus,
  CreditCard,
  TrendingUp,
  Globe,
  Activity,
  Wallet,
} from "lucide-react";

import TitleBloc from "@/components/bloc/title-bloc";
import { useFluvia } from "@/hooks/use-fluvias";
import { Skeleton } from "@/components/ui/skeleton";
import { getTotalBalanceOfUSDC } from "@/lib/getBalance";

export default function DashboardPage() {
  const [stats, setStats] = useState({
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
  const [fluviaAdddresses, setFluviaAdddresses] = useState<string[]>([]);
  const [receiverAddresses, setReceiveAddresses] = useState<string[]>([]);
  const [totalBalanceReceiver, setTotalBalanceReceiver] = useState<number>(0);
  const [totalBalanceFluvia, setTotalBalanceFluvia] = useState<number>(0);
  const [isLoadingBalanceFluvia, setIsLoadingBalanceFluvia] =
    useState<boolean>(false);
  const [isLoadingBalanceReceiver, setIsLoadingBalanceReceiver] =
    useState<boolean>(false);

  const { fluvias, loading: loadingFluvias } = useFluvia();

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      // Simulate fetching user stats
      setStats({
        totalVolume: 125000,
        activeChains: 3,
        recentTransactions: [],
      });
    }
  }, [authenticated, user?.wallet?.address]);

  useEffect(() => {
    if (fluvias) {
      setFluviaAdddresses(fluvias.map((fluvia) => fluvia.contractAddress));
      setReceiveAddresses(fluvias.map((fluvia) => fluvia.receiverAddress));
    }
  }, [fluvias]);

  const fetchTotalBalanceReceivers = async () => {
    try {
      setIsLoadingBalanceReceiver(true);
      const totalBalance = await getTotalBalanceOfUSDC(receiverAddresses);
      setTotalBalanceReceiver(totalBalance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingBalanceReceiver(false);
    }
  };

  const fetchTotalBalanceFluvias = async () => {
    try {
      setIsLoadingBalanceFluvia(true);
      const totalBalance = await getTotalBalanceOfUSDC(
        fluvias.map((fluvia) => fluvia.contractAddress)
      );
      setTotalBalanceFluvia(totalBalance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingBalanceFluvia(false);
    }
  };

  useEffect(() => {
    if (receiverAddresses) {
      fetchTotalBalanceReceivers();
    }
  }, [receiverAddresses]);

  useEffect(() => {
    if (fluviaAdddresses) {
      fetchTotalBalanceFluvias();
    }
  }, [fluviaAdddresses]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Fluvias
                  </p>
                  {loadingFluvias ? (
                    <Skeleton className="w-24 h-6" />
                  ) : (
                    <p className="text-2xl font-bold">{fluvias?.length}</p>
                  )}
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

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fluvia Balance
                  </p>
                  {isLoadingBalanceFluvia ? (
                    <Skeleton className="w-24 h-6" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {totalBalanceFluvia} USDC
                    </p>
                  )}
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
                    Receiver Balance
                  </p>
                  {isLoadingBalanceReceiver ? (
                    <Skeleton className="w-24 h-6" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {totalBalanceReceiver} USDC
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
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
      </DashboardLayout>
    </>
  );
}
