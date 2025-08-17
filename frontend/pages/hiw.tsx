import { useRouter } from "next/router";
import { useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Image from "next/image";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Globe, TrendingUp, Users } from "lucide-react";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function HowItWorksPage() {
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  return (
    <>
      <Head>
        <title>How It Works - Fluvia</title>
        <meta name="description" content="Learn how Fluvia's multichain treasury management platform works" />
      </Head>

      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              How Fluvia Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive guide to understanding how Fluvia's multichain treasury management platform 
              revolutionizes cross-chain USDC operations for businesses.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Transfers</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Move USDC across blockchains in seconds with Circle's CCTP technology
                </p>
                <p className="text-sm text-muted-foreground">
                  Experience lightning-fast cross-chain transfers and real-time settlement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 text-2xl">⏰</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Time Saving & Auto-Settlement</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Automated workflows that save hours of manual treasury operations
                </p>
                <p className="text-sm text-muted-foreground">
                  Streamline your treasury management with intelligent automation, instant settlements, and reduced manual intervention for maximum efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-500 text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Comprehensive dashboard with portfolio tracking and insights
                </p>
                <p className="text-sm text-muted-foreground">
                  Monitor your cross-chain portfolio with real-time data, analytics, and automated reporting.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Problem Statement */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Traditional treasury management is fragmented across multiple blockchains, requiring manual 
                coordination, multiple wallets, and inefficient capital allocation. Businesses struggle with:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-red-500" />
                  Manual cross-chain transfers taking hours or days
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-red-500" />
                  Idle capital scattered across multiple networks
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-red-500" />
                  Complex multi-wallet management and security risks
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-red-500" />
                  Lack of real-time visibility across all blockchain positions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Solution Overview */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                The Fluvia Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Fluvia provides a unified platform that consolidates treasury management across all 
                supported blockchains, enabling businesses to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Full Control</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage all blockchain operations from a single dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Instant Cross-Chain</h4>
                      <p className="text-sm text-muted-foreground">
                        Move USDC between networks in seconds, not hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Smart Capital Routing</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically optimize capital allocation across chains
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-Time Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor portfolio performance and transaction history
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Excalidraw Drawing 1: System Architecture */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">🏗️</span>
                </div>
                System Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <Image
                  src="/images/system.svg"
                  alt="Fluvia System Architecture"
                  width={1920}
                  height={1080}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* How It Works Steps */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">⚡</span>
                </div>
                How It Works - Step by Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Connect Your Wallets</h4>
                    <p className="text-muted-foreground">
                      Securely connect your existing wallets from multiple blockchains through our 
                      <span className="font-bold"> privy.io</span> authentication system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Create your Fluvia</h4>
                    <p className="text-muted-foreground">
                      Simply provide your receiving address and the label of your Fluvia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Enjoy your Fluvia</h4>
                    <p className="text-muted-foreground">
                      You can now send USDC to your Fluvia and it will be automatically routed to your receiving address.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>




          {/* Key Benefits */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">💡</span>
                </div>
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Increased Efficiency</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduce manual treasury operations by 90% through automation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl font-bold mt-1">$</span>
                    <div>
                      <h4 className="font-semibold">Reduce Idle Capital</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduce idle capital scattered across multiple networks
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Faster Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        Cross-chain transfers in seconds instead of hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">Reduce risk of loss</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduce risk of loss by routing USDC to your receiving address
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="text-center">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Experience the future of treasury management with Fluvia's powerful multichain platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3"
                  onClick={() => window.open('https://docs.fluvia.xyz', '_blank')}
                >
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
} 