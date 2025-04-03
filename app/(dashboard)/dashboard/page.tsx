"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Dash from "@/containers/student/dash";
import Assignments from "@/containers/student/assignments";

export default function Page() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("Dashboard");

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
                  <Dash setActiveTab={handleTabChange} />
                </div>
              )}
              {activeTab === "Assignments" && (
                <div className="px-4 lg:px-6">
                  <Assignments setActiveTab={handleTabChange} />
                </div>
              )}
              {activeTab === "Grades & Feedback" && (
                <div className="px-4 lg:px-6">
                  <h2 className="text-xl font-bold">Grades & Feedback</h2>
                  <p>Here you can view your grades and feedback.</p>
                  {/* Add your grades content here */}
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
