import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/router";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Index() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="full" size="lg" />
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open("https://docs.fluvia.xyz", "_blank")}
              >
                Documentation
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        {/* Fluvia angled wave background image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src="/images/fluvia-angled-wave.svg"
            alt="Fluvia Angled Wave Background"
            width={1920}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-foreground mb-8">
            🚀 Now supporting 3 blockchains
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight relative z-10">
            Financial infrastructure
            <br />
            <span className="text-foreground">for the future</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Fluvia is a multichain treasury management platform that helps
            businesses seamlessly manage and move USDC across multiple
            blockchains.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              Start managing your treasury →
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to manage your treasury
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for asset managers, designed for businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-xl">Instant Transfers</CardTitle>
                <CardDescription>
                  Move USDC across blockchains in seconds with Circle's CCTP
                  technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience lightning-fast cross-chain transfers and real-time
                  settlement.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <span className="text-2xl">⏰</span>
                </div>
                <CardTitle className="text-xl">
                  Time Saving & Auto-Settlement
                </CardTitle>
                <CardDescription>
                  Automated workflows that save hours of manual treasury
                  operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streamline your treasury management with intelligent
                  automation, instant settlements, and reduced manual
                  intervention for maximum efficiency.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-xl">Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboard with portfolio tracking and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your cross-chain portfolio with real-time data,
                  analytics, and automated reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold mb-4">
                Ready to transform your treasury management?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses already using Fluvia to streamline
                their cross-chain operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold hover:bg-muted/50"
                >
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <Logo variant="full" size="md" />
              <p className="mt-4 text-sm text-muted-foreground">
                Financial infrastructure for the future of business.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <a
                href="https://docs.fluvia.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 Fluvia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
