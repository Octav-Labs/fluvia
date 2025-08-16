import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/router";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavProjects({
  projects,
  disabled,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  disabled: boolean;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="space-y-3 px-2">
        {projects.map((item) => {
          const isActive = router.pathname === item.url;
          return (
            <div key={item.name}>
              {disabled ? (
                <div className="flex items-center space-x-3 px-3 py-2 cursor-not-allowed opacity-50">
                  <item.icon className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
              ) : (
                <Link href={item.url} className="block">
                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "bg-card shadow-sm border-l-4 border-primary text-primary"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </SidebarGroup>
  );
}
