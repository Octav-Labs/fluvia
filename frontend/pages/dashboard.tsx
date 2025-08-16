import { useRouter } from "next/router";
import { useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import WalletList from "../components/WalletList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default function DashboardPage() {
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

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  return (
    <>
      <Head>
        <title>Fluvia Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </DashboardLayout>

      {/* <DashboardLayout>
        <div className="flex flex-col bg-background">
          <h1 className="text-3xl font-bold text-foreground">
            Fluvia Dashboard
          </h1>
          {ready && authenticated ? (
            <>
              <div className="flex flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                  Fluvia Dashboard
                </h1>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Account Connections</CardTitle>
                  <CardDescription>
                    Manage your connected accounts and wallets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    {googleSubject ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkGoogle(googleSubject);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Google
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          linkGoogle();
                        }}
                      >
                        Link Google
                      </Button>
                    )}

                    {twitterSubject ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkTwitter(twitterSubject);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Twitter
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          linkTwitter();
                        }}
                      >
                        Link Twitter
                      </Button>
                    )}

                    {discordSubject ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkDiscord(discordSubject);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Discord
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          linkDiscord();
                        }}
                      >
                        Link Discord
                      </Button>
                    )}

                    {email ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkEmail(email.address);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Email
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={linkEmail}>
                        Connect Email
                      </Button>
                    )}

                    {wallet ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkWallet(wallet.address);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Wallet
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={linkWallet}>
                        Connect Wallet
                      </Button>
                    )}

                    {phone ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          unlinkPhone(phone.number);
                        }}
                        disabled={!canRemoveAccount}
                      >
                        Unlink Phone
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={linkPhone}>
                        Connect Phone
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => verifyToken().then(setVerifyResult)}
                    >
                      Verify Token
                    </Button>
                  </div>

                  {Boolean(verifyResult) && (
                    <details className="w-full mt-6">
                      <summary className="font-semibold text-sm text-muted-foreground cursor-pointer">
                        Server verify result
                      </summary>
                      <pre className="max-w-4xl bg-muted text-muted-foreground font-mono p-4 text-xs sm:text-sm rounded-md mt-2 overflow-auto">
                        {JSON.stringify(verifyResult, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Wallets</CardTitle>
                  <CardDescription>
                    Manage your connected blockchain wallets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WalletList />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Data</CardTitle>
                  <CardDescription>
                    Your complete user object from Privy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="max-w-4xl bg-muted text-muted-foreground font-mono p-4 text-xs sm:text-sm rounded-md overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </>
          ) : (
            <div>Not authenticated</div>
          )}
        </div>
      </DashboardLayout> */}
    </>
  );
}
