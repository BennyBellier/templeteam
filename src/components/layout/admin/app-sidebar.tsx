"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelectedLayoutSegment } from "next/navigation";
// import { SearchForm } from "./search-form";
import { Folders, HandCoins, SquareTerminal } from "lucide-react";
import { SeasonSwitcher } from "./season-switcher";

const data = {
  navMain: [
    {
      title: "Administration",
      icon: Folders,
      items: [
        {
          title: "Tableau de bord",
          url: "/admin/dashboard",
        },
        {
          title: "Membres",
          url: "/admin/members",
        },
      ],
    },
    {
      title: "Trésorerie",
      icon: HandCoins,
      items: [
        {
          title: "Dashboard",
          url: "/admin/tresorerie",
        },
      ],
    },
    {
      title: "Dev",
      icon: SquareTerminal,
      items: [
        {
          title: "Log",
          url: "/admin/logs",
        },
      ],
    },
  ],
};

export function AppAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = useSelectedLayoutSegment() ?? "admin";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SeasonSwitcher />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url.split("/").pop()}
                    >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
