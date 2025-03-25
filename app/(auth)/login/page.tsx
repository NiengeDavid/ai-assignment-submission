"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSignIn, useUser, useClerk } from "@clerk/nextjs"; // Clerk hooks
import { useRouter } from "next/navigation"; // For redirecting
import { toast } from "sonner";

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png"; // school logo path

// Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  // 1. Declare ALL hooks unconditionally at the top
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error messages
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn(); // Clerk sign-in hook
  const { redirectToSignIn } = useClerk(); // Clerk redirect hook
  const router = useRouter(); // For redirecting

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Effects after all hooks
  // Redirect if already signed in
  useEffect(() => {
    if (isUserLoaded && isSignInLoaded) {
      if (isSignedIn) {
        router.push("/dashboard");
      }
      setIsCheckingAuth(false);
    }
  }, [isSignedIn, isUserLoaded, isSignInLoaded, router]);

  // 3. Conditional rendering (never before hooks)
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // Attempt to sign in
      if (signIn) {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password,
        });

        if (result.status === "complete") {
          // Set the user as active and redirect to the dashboard
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
        }
      } else {
        setError("Sign-in service is unavailable.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.errors[0].message); // Display error message
      toast("Uh oh! Wrong password or email .", {
        description: "Check and try again!",
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    // Redirect to the password reset page
    redirectToSignIn({
      redirectUrl: "/login", // Replace with your password reset page URL
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-8 md:mx-auto md:flex-row md:items-center md:justify-center md:space-x-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md"
        >
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

          {/* Header */}
          <div>
            <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-12">
              Access your assignments, track submissions, and view feedback
              effortlessly.
            </p>
          </div>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="enabled:hover:border-blue-600 disabled:opacity-75"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="enabled:hover:border-blue-600 disabled:opacity-75"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 font-bold dark:text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          {/* Login Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold mt-6"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-bold dark:text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>

      {/* Background Image */}
      <div className="w-full max-w-md mt-8 md:mt-0 md:max-w-md lg:max-w-2xl">
        <Image
          src={Bg}
          alt="Background image"
          height={960}
          width={719}
          className="rounded-xl w-auto h-auto"
        />
      </div>
    </div>
  );
}
