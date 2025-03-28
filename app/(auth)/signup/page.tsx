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
import { Eye, EyeOff } from "lucide-react"; // For eye icons
import { Loader2 } from "lucide-react"; // For loading spinner
import { useSignUp } from "@clerk/nextjs"; // Clerk signup hook
import { useRouter } from "next/navigation"; // For redirecting
import { toast } from "sonner";
import { readToken } from "@/sanity/lib/sanity.api";
import {
  getClient,
  getAllDepartments,
  getAllFaculties,
} from "@/sanity/lib/sanity.client";
import { Department, Faculty } from "@/sanity/lib/sanity.queries";

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png";

// Combined Schema with all possible fields
const formSchema = z
  .object({
    // Step 1
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    role: z.enum(["student", "lecturer", "admin"]),

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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const client = getClient({ token: readToken });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [departmentsData, facultiesData] = await Promise.all([
        getAllDepartments(client),
        getAllFaculties(client),
      ]);
      setDepartments(departmentsData);
      setFaculties(facultiesData);
    };

    fetchData();
    // console.log("Departments:", departments);
    // console.log("Faculties:", faculties);
  }, [client]);

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"student" | "lecturer" | "admin" | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const { isLoaded, signUp } = useSignUp(); // Clerk signup hook
  const router = useRouter(); // For redirecting

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
          role: z.enum(["student", "lecturer", "admin"]),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 2 && role === "student") {
      const result = z
        .object({
          registrationNumber: z
            .string()
            .min(1, "Registration Number is required"),
          faculty: z.string().min(1, "Faculty is required"),
          department: z.string().min(1, "Department is required"),
          level: z.string().min(1, "Level is required"),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 2 && role !== "student") {
      const result = z
        .object({
          idNumber: z.string().min(1, "ID Number is required"),
          faculty: z.string().min(1, "Faculty is required"),
          department: z.string().min(1, "Department is required"),
        })
        .safeParse(data);

      if (!result.success) return result.error;
    }

    if (step === 3) {
      const result = z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string().min(8, "Confirm Password is required"),
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const validation = validateStep(data);
    if (validation !== true) return;
    if (!isLoaded) return;

    if (step === 1) {
      setRole(data.role);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setIsSubmitting(true); // Start loading
      // Submit to Clerk
      try {
        // Create user with Clerk
        const result = await signUp.create({
          emailAddress: data.email,
          password: data.password,
          firstName: data.fullName.split(" ")[0], // Extract first name
          lastName: data.fullName.split(" ")[1] || "", // Extract last name
          unsafeMetadata: {
            // Include all form data in metadata
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            role: data.role,
            registrationNumber: data.registrationNumber,
            faculty: data.faculty,
            department: data.department,
            level: data.level,
            idNumber: data.idNumber,
          },
        });

        // Prepare email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // Redirect to email verification page
        router.push("/verify-email");
      } catch (err) {
        console.error("Error during signup:", err);
        toast("Uh oh! Something went wrong.", {
          description: "There was a problem with your request. Try again",
          closeButton: true,
        });
      } finally {
        setIsSubmitting(false); // Stop loading
        console.log("Form Data:", data);
      }
    }
    //     await new Promise((resolve) => setTimeout(resolve, 2000));
    //     console.log("Form Data:", data);
    //     setIsSubmitting(false); // Stop loading
    //   }
    // }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-8 md:mx-auto md:flex-row md:items-center md:justify-center md:space-x-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md"
        >
          {/* Add the CAPTCHA element */}
          <div id="clerk-captcha"></div>

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

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
                  Create Your Account!
                </h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                  Submit assignments, track progress, and receive feedback—all
                  in one place.
                </p>

                {/* Breadcrumb */}
                <div className="text-sm text-center text-blue-500 font-bold mb-12">
                  Step {step} of 3
                </div>
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
                        placeholder="John S. Deo"
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
                        placeholder="demo@email.com"
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
                        placeholder="090X XXXX XXX"
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
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 2: Role-Specific Details */}
          {step === 2 && role === "student" && (
            <>
              <div>
                <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
                  Student Details!
                </h2>

                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                  Submit assignments, track progress, and receive feedback—all
                  in one place.
                </p>

                {/* Breadcrumb */}
                <div className="text-sm text-center text-blue-500 font-bold mb-12">
                  Step {step} of 3
                </div>
              </div>

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="Registration Number"
                        {...field}
                        required
                      />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                          <SelectValue placeholder="Select your faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-bg1">
                        {faculties.map((faculty) => (
                          <SelectItem
                            key={faculty._id}
                            value={faculty.name || ""}
                          >
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-bg1">
                        {departments.map((department) => (
                          <SelectItem
                            key={department._id}
                            value={department.name || ""}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-bg1">
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="300">300</SelectItem>
                        <SelectItem value="400">400</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (role === "lecturer" || role === "admin") && (
            <>
              <div>
                <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
                  {role} Details
                </h2>

                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                  Submit assignments, track progress, and receive feedback—all
                  in one place.
                </p>

                {/* Breadcrumb */}
                <div className="text-sm text-center text-blue-500 font-bold mb-12">
                  Step {step} of 3
                </div>
              </div>
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="ID Number"
                        {...field}
                        required
                      />
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
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="Faculty"
                        {...field}
                        required
                      />
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
                      <Input
                        className="enabled:hover:border-blue-600 disabled:opacity-75"
                        placeholder="Department"
                        {...field}
                        required
                      />
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
              <div>
                <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
                  Set Your Password
                </h2>

                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                  Submit assignments, track progress, and receive feedback—all
                  in one place.
                </p>

                {/* Breadcrumb */}
                <div className="text-sm text-center text-blue-500 font-bold mb-12">
                  Step {step} of 3
                </div>
              </div>
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
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
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
                      <div className="relative">
                        <Input
                          className="enabled:hover:border-blue-600 disabled:opacity-75"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === 3 ? (
                "Sign Up"
              ) : (
                "Next"
              )}
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
          className="rounded-xl h-auto w-auto"
        />
      </div>
    </div>
  );
}
