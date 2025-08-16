import * as React from "react";
import { CreditCardIcon, Frame, User } from "lucide-react";
import { getAccessToken, useLogin, usePrivy } from "@privy-io/react-auth";

import { NavProjects } from "@/components/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/router";

// This is sample data.
const data = {
  projects: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "My Fluvia's",
      url: "/fluvias",
      icon: User,
    },
    {
      name: "Transactions",
      url: "/transactions",
      icon: CreditCardIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { ready, authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/images/logowithoutbackground.png"
            alt="Fluvia Logo"
            width={60}
            height={60}
          />
          <h1 className="text-2xl font-bold">Fluvia</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {ready && authenticated && (
          <div>
            <p>Hello {user?.wallet?.address?.slice(0, 6)}...</p>
          </div>
        )}
        <Separator className="my-2" />
        <NavProjects disabled={!authenticated} projects={data.projects} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
