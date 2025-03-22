"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // For loading spinner
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png"; // school logo path

export default function VerifyEmailPage() {
  const [code, setCode] = useState(""); // For verification code input
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error messages

  const { isLoaded, signUp, setActive } = useSignUp(); // Clerk hooks
  const router = useRouter(); // For redirecting

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // Attempt to verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification is successful, set the user as active
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard"); // Redirect to dashboard
      }
    } catch (err: any) {
      console.error("Error verifying email:", err);
      setError(err.errors[0].message); // Display error message
      toast("Uh oh! Something went wrong.", {
        description: "There was a problem with your request. Try again",
        closeButton: true,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-8 md:mx-auto md:flex-row md:items-center md:justify-center md:space-x-12">
      <div className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md">
        {/* School logo */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src={SchoolLogo}
            alt="School Logo"
            width={92}
            height={38}
            className="w-auto h-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">We sent a code!</h1>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter the verification code sent to your email address.
        </p>

        {/* Verification Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 items-center flex justify-center flex-col"
        >
          {/* <Input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          /> */}

          <InputOTP
            value={code}
            onChange={(code) => setCode(code)}
            required
            maxLength={6}
            className="enabled:hover:border-blue-600 disabled:opacity-75"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold mt-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </div>

      {/* Background Image */}
      <div className="w-full max-w-md mt-8 md:mt-0 md:max-w-md lg:max-w-2xl">
        <Image
          src={Bg}
          alt="Background image"
          height={960}
          width={719}
          className="rounded-xl h-auto w-auto"
        />
      </div>
    </div>
  );
}
