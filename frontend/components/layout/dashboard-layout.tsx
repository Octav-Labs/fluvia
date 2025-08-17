"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

import { usePrivy } from "@privy-io/react-auth";

import { ThemeSwitcher } from "../theme-switcher";
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
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-end p-4">
              <ThemeSwitcher />
            </div>
            {ready && authenticated && (
              <div className="px-8 py-4">{children}</div>
            )}
            {ready && !authenticated && (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center space-y-4">
                  <h1 className="text-2xl font-semibold text-foreground">
                    Welcome to Fluvia
                  </h1>
                  <p className="text-muted-foreground">
                    To start using Fluvia, please sign in.
                  </p>
                  <Button onClick={login} className="px-6 py-2">
                    Sign in
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
