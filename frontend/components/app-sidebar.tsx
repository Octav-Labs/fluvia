import * as React from "react";

import { CreditCardIcon, Frame, LogOut, User, Home, DollarSign, HelpCircle } from "lucide-react";
import { getAccessToken, useLogin, usePrivy } from "@privy-io/react-auth";

import { NavProjects } from "@/components/nav-projects";
import { ThemeSwitcher } from "@/components/theme-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { UserBlock } from "./user-block";

// This is sample data.
const data = {
  projects: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      name: "My Fluvia's",
      url: "/fluvias",
      icon: DollarSign,
    },
    {
      name: "Transactions",
      url: "/transactions",
      icon: CreditCardIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { authenticated } = usePrivy();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
        <Separator className="my-2" />
        <NavProjects disabled={!authenticated} projects={data.projects} />
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <div className="flex items-center flex-col justify-between px-2 py-2">
          <div className="w-full mb-3">
            <a
              href="/hiw"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            >
              <HelpCircle className="w-4 h-4" />
              How It Works
            </a>
          </div>
          <UserBlock />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
