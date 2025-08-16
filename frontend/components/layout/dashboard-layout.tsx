"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { ThemeSwitcher } from "../theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin();
  return (
    <div>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-end p-4">
              <ThemeSwitcher />
            </div>
            {ready && authenticated && <div className="p-8">{children}</div>}
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
