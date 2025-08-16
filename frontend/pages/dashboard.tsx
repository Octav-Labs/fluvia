import { useRouter } from "next/router";
import { useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import DashboardLayout from "@/components/layout/dashboard-layout";

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

  return (
    <>
      <Head>
        <title>Fluvia Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <h1 className="text-2xl font-bold text-foreground">
            Fluvia Dashboard
          </h1>
          <p className="text-gray-600">Manage your fluvia's</p>
        </div>
      </DashboardLayout>
    </>
  );
}
