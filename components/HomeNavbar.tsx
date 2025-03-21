// components/HomeNavbar.tsx
"use client"; // Mark this as a Client Component

import Image from "next/image";
import { useTheme } from "@/app/useTheme";
import { Button } from "@/components/ui/button"; // using shadcn/ui

const SchoolLogo = "/assets/school-logo.png"; // school logo path

export default function HomeNavbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white dark:bg-bg2 border-b border-gray-200 dark:border-gray-700">
      {/* School Logo and Project Name */}
      <div className="flex items-center space-x-4">
        <Image
          src={SchoolLogo}
          alt="School Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Assignment System
        </h1>
      </div>

      {/* Dark/Light Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="cursor-pointer"
      >
        {theme === "light" ? (
          <MoonIcon className="h-5 w-5" /> // Moon icon for dark mode
        ) : (
          <SunIcon className="h-5 w-5" /> // Sun icon for light mode
        )}
      </Button>
    </nav>
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
