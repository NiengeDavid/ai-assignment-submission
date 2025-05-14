// filepath: /app/unauthorized/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Lock, AlertTriangle, Mail } from "lucide-react";

export default function UnauthorizedPage() {
  const supportEmail = "support@yourdomain.com"; // Replace with your actual support email
  const emailSubject = "Unauthorized Access Request";
  const emailBody =
    "Hello,\n\nI encountered an unauthorized access message when trying to view a page. Can you help?\n\nDetails:";

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg2 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <Lock className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to view this page. Please contact support if
          you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
              className="flex items-center"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </a>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Email us at{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-blue-600 hover:underline"
            >
              {supportEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
