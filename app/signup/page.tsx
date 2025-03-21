// app/signup/page.tsx
"use client";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png";

// Combined Schema with all possible fields
const formSchema = z.object({
  // Step 1
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  role: z.enum(["Student", "Teacher", "Admin"]),

  // Step 2 Student
  registrationNumber: z.string().optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  level: z.string().optional(),

  // Step 2 Staff
  idNumber: z.string().optional(),

  // Step 3
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"Student" | "Teacher" | "Admin" | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      role: undefined,
      registrationNumber: "",
      faculty: "",
      department: "",
      level: "",
      idNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Add step-specific validation
  const validateStep = (data: z.infer<typeof formSchema>) => {
    if (step === 1) {
      const result = z
        .object({
          fullName: z.string().min(1),
          email: z.string().email(),
          phoneNumber: z.string().min(1),
          role: z.enum(["Student", "Teacher", "Admin"]),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 2 && role === "Student") {
      const result = z
        .object({
          registrationNumber: z.string().min(1),
          faculty: z.string().min(1),
          department: z.string().min(1),
          level: z.string().min(1),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 2 && role !== "Student") {
      const result = z
        .object({
          idNumber: z.string().min(1),
          faculty: z.string().min(1),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 3) {
      const result = z
        .object({
          password: z.string().min(8),
          confirmPassword: z.string().min(8),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    return true;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const validation = validateStep(data);
    if (validation !== true) return;

    if (step === 1) {
      setRole(data.role);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Submit to Clerk
      console.log("Form Data:", data);
    }
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

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
                Create Your Account!
              </h2>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                Submit assignments, track progress, and receive feedback—all in
                one place.
              </p>

              {/* Breadcrumb */}
              <div className="text-sm text-center text-blue-500 font-bold mb-12">
                Step {step} of 3
              </div>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75 "
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-bg1">
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 2: Role-Specific Details */}
          {step === 2 && role === "Student" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Student Details
              </h2>
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Registration Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Faculty</FormLabel>
                    <FormControl>
                      <Input placeholder="Faculty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input placeholder="Level" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (role === "Teacher" || role === "Admin") && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {role} Details
              </h2>
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ID Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Faculty</FormLabel>
                    <FormControl>
                      <Input placeholder="Faculty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 3: Set Password */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Set Your Password
              </h2>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 w-full">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold"
              >
                Back
              </Button>
            )}
            <Button
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold"
              type="submit"
            >
              {step === 3 ? "Sign Up" : "Next"}
            </Button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-bold dark:text-blue-500 hover:underline"
              >
                Sign In
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
