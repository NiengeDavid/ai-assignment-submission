"use client";

import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Welcome, {user?.firstName}!
        </p>
      </div>
    </div>
  );
}