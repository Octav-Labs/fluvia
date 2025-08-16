import * as React from "react";
import { CreditCardIcon, Frame, User } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

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
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
