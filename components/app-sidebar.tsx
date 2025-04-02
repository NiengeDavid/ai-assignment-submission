"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  //IconDatabase,
  IconFileAi,
  IconFileDescription,
  //IconFileWord,
  //IconFolder,
  IconHelp,
  IconListDetails,
  //IconReport,
  IconSearch,
  IconSettings,
  //IconUsers,
  IconHome,
  IconBell,
  IconHelpHexagon,
} from "@tabler/icons-react";
import Image from "next/image"; // Add this import
import SchoolLogo from "@/public/assets/school-logo.png"; // Adjust path to your logo

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activetab: string;
  onTabChange: (tab: string) => void;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconHome,
    },
    {
      title: "Assignments",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Grades & Feedback",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Notifications",
      url: "#",
      icon: IconBell,
    },
    // {
    //   title: "Account Settings",
    //   url: "#",
    //   icon: IconSettings,
    // },
    // {
    //   title: "Help & Support",
    //   url: "#",
    //   icon: IconHelpHexagon,
    // },
  ],

  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: IconCamera,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelpHexagon,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
};

export function AppSidebar({
  activetab,
  onTabChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="dark:bg-bg2">
      <SidebarHeader className="dark:bg-bg2">
        <SidebarMenu className="dark:bg-bg2">
          <SidebarMenuItem className="dark:bg-bg2">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent mt-4 md:mt-0 dark:bg-bg2"
            >
              <a href="/dashboard">
                <Image
                  src={SchoolLogo}
                  alt="School Logo"
                  width={215} // Adjust size as needed
                  height={62}
                  className="h-8 w-auto" // Maintain aspect ratio
                />
                {/* Optional: Keep or remove the text */}
                <span className="text-base text-orange-300 font-semibold">
                  Mewar Intl. University
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="dark:bg-bg2 flex flex-col justify-between my-auto">
        <NavMain
          items={data.navMain}
          activetab={activetab}
          onTabChange={onTabChange}
        />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary
          items={data.navSecondary}
          activetab={activetab}
          onTabChange={onTabChange}
        />
      </SidebarContent>
      <SidebarFooter className="dark:bg-bg2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
