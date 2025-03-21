"use client";
import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react"; // For eye icons
import { Loader2 } from "lucide-react"; // For loading spinner

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png"; // school logo path

// Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true); // Start loading
    // Simulate a login delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Login Data:", data);
    setIsSubmitting(false); // Stop loading
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
              className=""
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
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
