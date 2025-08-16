import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Logo variant="full" size="lg" />
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Get Started
              </Button>
              <Button variant="secondary" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
            Welcome to Fluvia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fluvia is a multichain treasury management platform that helps
            businesses seamlessly manage and move USDC across multiple
            blockchains.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg">
              Start Flowing
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Powered by Circle’s CCTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Powered by Circle’s CCTP, Fluvia enables instant, secure, and
              low-cost cross-chain transfers, real-time portfolio visibility,
              and smart capital routing — so your funds are always where they
              deliver the most value.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Logo variant="full" size="md" />
            <p className="mt-4 md:mt-0 text-primary-foreground/80">
              © 2024 Fluvia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
