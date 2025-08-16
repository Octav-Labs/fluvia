"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

import { usePrivy } from "@privy-io/react-auth";
import { useLoginWithPrivy } from "@/hooks/use-login-with-privy";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();

  const { login } = useLoginWithPrivy();
  return (
    <div>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          {ready && authenticated && <div className="p-8">{children}</div>}
          {ready && !authenticated && (
            <div className="flex items-center justify-center">
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome to Fluvia
                </h1>
                <p className="text-gray-600">
                  To start using Fluvia, please sign in.
                </p>
                <Button onClick={login} className="px-6 py-2">
                  Sign in
                </Button>
              </div>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
