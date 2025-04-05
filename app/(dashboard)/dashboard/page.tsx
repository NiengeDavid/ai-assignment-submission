"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Dash from "@/containers/student/dash";
import Assignments from "@/containers/student/assignments";
import Grades from "@/containers/student/grades";

interface Assignment {
  id: string;
  image: string;
  lecturer: {
    avatar: string;
    name: string;
  };
  dueDate: string;
  course: string;
  title: string;
  question: string;
  btnAction: {
    text: string;
    link: string;
  };
  resources: {
    name: string; // e.g., "Assignment Details.docx"
    size: string; // e.g., "24 KB"
    link: string; // e.g., "/assets/resources/assignment-details.docx"
  }[]; //
}

export default function Page() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        activetab={activeTab}
        onTabChange={handleTabChange}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Conditionally render content based on the active tab */}
              {activeTab === "Dashboard" && (
                <div className="px-4 lg:px-6">
                  {/* Add your dashboard content here */}
                  <Dash
                    setActiveTab={handleTabChange}
                    setSelectedAssignment={setSelectedAssignment}
                  />
                </div>
              )}
              {activeTab === "Assignments" && (
                <div className="px-4 lg:px-6">
                  <Assignments
                    setActiveTab={handleTabChange}
                    selectedAssignment={selectedAssignment}
                    setSelectedAssignment={setSelectedAssignment}
                  />
                </div>
              )}
              {activeTab === "Grades & Feedback" && (
                <div className="px-4 lg:px-6">
                  {/* Add your grades content here */}
                  <Grades />
                </div>
              )}
              {activeTab === "Notifications" && (
                <div className="px-4 lg:px-6">
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p>Here you can view your notifications.</p>
                  {/* Add your notifications content here */}
                </div>
              )}
              {activeTab === "Settings" && (
                <div className="px-4 lg:px-6">
                  <h2 className="text-xl font-bold">Settings</h2>
                  <p>Here you can manage your account settings.</p>
                  {/* Add your settings content here */}
                </div>
              )}
              {activeTab === "Help & Support" && (
                <div className="px-4 lg:px-6">
                  <h2 className="text-xl font-bold">Help & Support</h2>
                  <p>Here you can find help and support resources.</p>
                  {/* Add your help and support content here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
