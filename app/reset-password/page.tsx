// app/reset-password/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function ResetPasswordPage() {
  const { handlePasswordReset } = useClerk();
  const router = useRouter();

  // Handle password reset
  const handleReset = async () => {
    try {
      await handlePasswordReset({
        redirectUrl: "/login", // Redirect to login after reset
      });
    } catch (err) {
      console.error("Password reset error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter your email to reset your password.
        </p>
        <button
          onClick={handleReset}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}