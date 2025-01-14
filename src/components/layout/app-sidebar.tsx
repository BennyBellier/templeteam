import { ThemeToggleSidebar } from "@/components/theme/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebarCustom";
import { Typography } from "@/components/ui/typography";
import { NavigationLinks } from "@/lib/site-config";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

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
                        <Typography as={Link} href={item.href}>
                          {item.name}
                        </Typography>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarMenu key={uuidv4()}>
              <SidebarMenuItem className="list-none">
                <SidebarMenuButton asChild>
                  <Typography as={Link} href={link.href}>
                    {link.name}
                  </Typography>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ),
        )}
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggleSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
