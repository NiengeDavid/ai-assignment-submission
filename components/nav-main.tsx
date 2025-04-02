"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavMainProps {
  items: { title: string; url: string; icon: React.ComponentType }[];
  activetab: string;
  onTabChange: (tab: string) => void;
}

export function NavMain({ items, activetab, onTabChange }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 mt-4">
        <SidebarMenu className="gap-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => onTabChange(item.title)}
                className={`cursor-pointer font-medium rounded-none ${
                  activetab === item.title
                    ? "bg-bg4 text-white"
                    : "dark:hover:bg-bg4"
                }`}
              >
                {item.icon && <item.icon />}
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
