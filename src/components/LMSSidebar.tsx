import { BookOpen, Home, NotebookPen, Video } from "lucide-react";
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

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "My Courses", icon: BookOpen, url: "/courses" },
  { title: "My Notes", icon: NotebookPen, url: "/notes" },
  { title: "Library", icon: Video, url: "/library" },
];

export function LMSSidebar() {
  return (
    <Sidebar variant="inset" collapsible="none" className="h-16 border-b">
      <SidebarContent className="h-full py-0">
        <SidebarGroup className="h-full">
          <SidebarGroupContent>
            <SidebarMenu className="flex-row h-full items-center justify-center gap-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
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