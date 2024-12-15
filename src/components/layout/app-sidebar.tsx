import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavigationLinks } from "@/lib/site-config";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { ThemeToggleSidebar } from "@/components/theme/ThemeToggle";


export function AppSidebar() {
  return (
    <Sidebar side="right" variant="inset">
      <SidebarContent>
        {NavigationLinks.map((link) =>
          link.content ? (
            <SidebarGroup key={uuidv4()}>
              <Typography as={SidebarGroupLabel}>{link.name}</Typography>
              <SidebarGroupContent>
                <SidebarMenu>
                  {link.content.map((item) => (
                    <SidebarMenuItem key={uuidv4()}>
                      <SidebarMenuButton asChild>
                        <Typography as={Link} href={item.href}>{item.name}</Typography>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarMenuItem className="list-none" key={uuidv4()}>
              <SidebarMenuButton asChild>
                <Typography as={Link} href={link.href}>{link.name}</Typography>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggleSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
