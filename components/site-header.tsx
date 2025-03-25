"use client";

import { useTheme } from "@/app/useTheme";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser, UserButton } from "@clerk/nextjs";
import { BellIcon } from "lucide-react";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:bg-bg2 ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-bold">
          {isLoaded && isSignedIn
            ? `Welcome ${user?.fullName || user?.firstName}`
            : "Welcome!"}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Theme Button   */}
          <div className="">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="cursor-pointer"
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Notification Bell */}
          {isLoaded && isSignedIn && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full cursor-pointer"
                onClick={() => {
                  // Notification click handler will go here
                }}
              >
                <BellIcon className="h-5 w-5" />
              </Button>
              {/* Notification badge */}
              <span className="absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 p-1 text-sm text-white">
                3<span className="sr-only">3 unread notifications</span>
              </span>
            </div>
          )}

          {/* User Button - Only shows when authenticated */}
          {isLoaded && isSignedIn && (
            <div className="ml-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8", // Adjust size as needed
                    userButtonPopoverCard:
                      "shadow-lg dark:shadow-gray-800 dark:bg-bg1", // Custom styling
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Icons for dark/light mode toggle
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
