"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RiBubbleChartFill, RiMoneyDollarCircleFill, RiUserCommunityFill } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { paragraphVariants } from "@/components/custom/P";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/dashboard/overview",
    icon: RiBubbleChartFill,
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: RiUserCommunityFill,
  },
  {
    title: "Payout",
    url: "/dashboard/payout",
    icon: RiMoneyDollarCircleFill,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent>
        <SidebarGroup className="space-y-3">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn(
                      paragraphVariants({
                        size: "small",
                        weight: "medium",
                      }),
                      "py-6 px-5 rounded-lg",
                      pathname === item.url && "bg-primary drop-shadow-xl text-white hover:bg-primary hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" /> {/* Added sizing and fixed component usage */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
