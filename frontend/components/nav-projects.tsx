import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/router";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
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
      <div className="space-y-2 p-2">
        {projects.map((item) => {
          const isActive = router.pathname === item.url;
          return (
            <Card key={item.name} className="overflow-hidden">
              {disabled ? (
                <div className="p-3 cursor-not-allowed opacity-50 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">
                      {item.name}
                    </span>
                  </div>
                </div>
              ) : (
                <Link href={item.url} className="block">
                  <div
                    className={`p-3 transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`h-4 w-4 ${
                          isActive ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </SidebarGroup>
  );
}
