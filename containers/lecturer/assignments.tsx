"use client";

import { useState, useEffect } from "react";
import { AssignmentCards } from "@/components/assignment-cards";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaFileAlt, FaDownload } from "react-icons/fa";
import { writeToken } from "@/sanity/lib/sanity.api";
import {
  getClient,
  getAllAssignment,
  deleteAssignment,
  updateAssignmentWithResources,
  uploadFileToSanity,
  getAllDepartments,
  getLecturerAssignments,
} from "@/sanity/lib/sanity.client";
import { Department, type Assignment } from "@/sanity/lib/sanity.queries";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CreateAssignment from "@/containers/lecturer/CreateAssignment";
import { useUser } from "@clerk/nextjs";

const avatar = "/assets/avatars/lecturer1.png";

// Define form schema using Zod
const assignmentFormSchema = z.object({
  title: z.string().optional(),
  course: z.string().optional(),
  dueDate: z.string().optional(),
  question: z.string().optional(),
  department: z.string().optional(),
  level: z.string().optional(),
  image: z.string().optional(),
  resources: z
    .array(
      z.object({
        name: z.string().optional(),
        file: z.any().optional(),
      })
    )
    .optional(),
});

interface AssignmentsProps {
  setActiveTab: (tab: string) => void;
  selectedAssignment: Assignment | null;
  setSelectedAssignment: React.Dispatch<
    React.SetStateAction<Assignment | null>
  >;
}

export default function LectAssignments({
  setActiveTab,
  selectedAssignment,
  setSelectedAssignment,
}: AssignmentsProps) {
  const client = getClient({ token: writeToken });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // New state for creating assignments
  const { user } = useUser();
  //   const { toast } = useToast();

  const currenctUserId = user?.id || ""; // Get the current user's ID
  const lecturerId = `user-${currenctUserId}`;
  //console.log("Lecturer ID:", lecturerId);

  // Initialize form
  const form = useForm<z.infer<typeof assignmentFormSchema>>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: selectedAssignment?.title || "",
      course: selectedAssignment?.course || "",
      dueDate: selectedAssignment?.dueDate
        ? sanityToInputDatetime(selectedAssignment.dueDate)
        : "",
      question: selectedAssignment?.question || "",
      department: selectedAssignment?.department?.name || "",
      level: selectedAssignment?.level || "",
      image: selectedAssignment?.image || "",
      resources:
        selectedAssignment?.resources?.map((resource) => ({
          name: resource.fileName,
          file: resource.fileUrl,
        })) || [],
    },
  });

  // Reset form when selectedAssignment changes
  useEffect(() => {
    if (selectedAssignment) {
      form.reset({
        title: selectedAssignment.title,
        course: selectedAssignment.course,
        dueDate: selectedAssignment.dueDate,
        question: selectedAssignment.question,
        department: selectedAssignment?.department?.name,
        level: selectedAssignment.level,
        image: selectedAssignment.image,
        resources: selectedAssignment.resources?.map((resource) => ({
          name: resource.fileName,
          file: resource.fileUrl,
        })),
      });
    }
  }, [selectedAssignment, form]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const [assignmentsData, departmentsData] = await Promise.all([
        getLecturerAssignments(client, lecturerId), // Fetch only the lecturer's assignments
        getAllDepartments(client),
      ]);
      setDepartments(departmentsData);
      setAssignments(assignmentsData);
      // console.log(assignmentsData)
    } catch (error) {
      // console.error("Error fetching assignments:", error);
      toast("Error", {
        description: "Failed to fetch assignments",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Convert Sanity datetime to input format
  function sanityToInputDatetime(sanityDatetime: string): string {
    if (!sanityDatetime) return "";

    // Create a Date object from the Sanity datetime
    const date = new Date(sanityDatetime);

    // Check if the date is valid
    if (isNaN(date.getTime())) return "";

    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (num: number) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Convert input format to Sanity datetime
  function inputToSanityDatetime(inputDatetime: string): string {
    if (!inputDatetime) return "";

    // datetime-local input gives us YYYY-MM-DDTHH:mm
    // Convert to full ISO string
    return new Date(inputDatetime).toISOString();
  }

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      setIsLoading(true);
      await deleteAssignment(client, assignmentToDelete);
      toast("Success", {
        description: "Assignment deleted successfully",
      });
      fetchAssignments();
      setSelectedAssignment(null);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast("Error", {
        description: "Failed to delete assignment",
      });
    } finally {
      setShowDeleteDialog(false);
      setAssignmentToDelete(null);
      setIsLoading(false);
    }
  };

  //Function that handles the assignment edits.
  const onSubmit = async (values: z.infer<typeof assignmentFormSchema>) => {
    try {
      if (!selectedAssignment) return;

      setIsLoading(true);

      await updateAssignmentWithResources(
        client,
        selectedAssignment._id,
        values
      );

      toast("Success", {
        description: "Assignment updated successfully",
      });

      fetchAssignments();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast("Error", {
        description: "Failed to update assignment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate the "dueIn" value with time consideration
  const calculateDueIn = (dueDate: string): string => {
    if (!dueDate) return "No deadline set";
    const due = new Date(dueDate);
    const now = new Date();
    const diffInMs = due.getTime() - now.getTime();

    if (diffInMs <= 0) return "Overdue";

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ${diffInHours % 24} hour${diffInHours % 24 !== 1 ? "s" : ""} left`;
    }
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ${diffInMinutes % 60} minute${diffInMinutes % 60 !== 1 ? "s" : ""} left`;
    }
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} left`;
  };

  // Helper function to format the due datetime
  const formatDueDate = (dueDate: string): string => {
    if (!dueDate) return "No deadline set";
    const date = new Date(dueDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper function to format resource file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-transparent w-full py-6 mx-auto space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="dark:bg-bg2">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              This action cannot be undone. This will permanently delete the
              assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 cursor-pointer flex items-center gap-2"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isCreating ? (
        // Render Create Assignment Form
        <CreateAssignment
          departments={
            departments.filter(
              (department) => department.name !== undefined
            ) as { _id: string; name: string }[]
          }
          lecturerId={lecturerId}
          onCancel={() => setIsCreating(false)} // Go back to the assignments list
          onAssignmentCreated={() => {
            setIsCreating(false); // Close the form
            fetchAssignments(); // Refresh the assignments list
          }}
        />
      ) : selectedAssignment ? (
        <div>
          <div className="flex justify-between items-center mx-auto gap-6 bg-transparent px-4">
            <div className="text-sm dark:text-white">
              <a
                onClick={() => {
                  setSelectedAssignment(null);
                  setIsEditing(false);
                }}
                className="font-semibold text-black/50 dark:text-txt1 lg:text-xl cursor-pointer hover:underline"
              >
                Assignments
              </a>{" "}
              &gt; &gt;{" "}
              <span className="font-semibold lg:text-2xl">
                {selectedAssignment.title}
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 hover:bg-blue-400 text-white font-medium px-4 py-2 cursor-pointer rounded-sm"
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </Button>
              <Button
                onClick={() => handleDeleteClick(selectedAssignment._id)}
                className="bg-red-500 hover:bg-red-400 text-white font-medium px-4 py-2 cursor-pointer rounded-sm"
              >
                Delete
              </Button>
            </div>
          </div>

          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="bg-gray-200 w-full py-6 px-4 m-6 mx-auto space-y-6 dark:bg-transparent">
                  <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
                    {/* Editable form fields */}
                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
                      <div className="w-full space-y-6 border-b-2 pb-8">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Assignment Title
                              </FormLabel>
                              <FormControl>
                                <Input className="py-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="course"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Course
                              </FormLabel>
                              <FormControl>
                                <Input className="py-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => {
                            // Convert the field value to proper input format
                            const inputValue = field.value
                              ? sanityToInputDatetime(field.value)
                              : "";

                            return (
                              <FormItem>
                                <FormLabel className="text-lg font-medium mb-1">
                                  Set Deadline
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="py-6"
                                    type="datetime-local"
                                    value={inputValue}
                                    onChange={(e) => {
                                      // Convert back to Sanity format when saving
                                      const sanityValue = inputToSanityDatetime(
                                        e.target.value
                                      );
                                      field.onChange(sanityValue);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="question"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Assignment Question
                              </FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={5} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Department
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                                    <SelectValue placeholder="Select your department" />
                                  </SelectTrigger>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Level
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full enabled:hover:border-blue-600 disabled:opacity-75">
                                    <SelectValue placeholder="Select your level" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-bg1">
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="200">200</SelectItem>
                                    <SelectItem value="300">300</SelectItem>
                                    <SelectItem value="400">400</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-medium mb-1">
                                Assignment Image
                              </FormLabel>
                              <div className="flex items-center gap-4">
                                {field.value && (
                                  <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                                    <Image
                                      src={field.value}
                                      alt="Assignment preview"
                                      className="h-full w-full object-cover"
                                      width={344}
                                      height={194}
                                    />
                                  </div>
                                )}
                                <FormControl>
                                  <div className="flex-1">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      className="cursor-pointer"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          try {
                                            const result =
                                              await uploadFileToSanity(
                                                client,
                                                file
                                              );
                                            field.onChange(result.url);
                                          } catch (error) {
                                            console.error(
                                              "Error uploading image:",
                                              error
                                            );
                                            toast("Error", {
                                              description:
                                                "Failed to upload image",
                                            });
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 w-full">
                        <FormLabel className="text-lg font-medium">
                          Resources
                        </FormLabel>
                        <div className="space-y-4">
                          {form.watch("resources")?.map((resource, index) => (
                            <div
                              key={index}
                              className="p-4 border-3 border-dashed rounded-lg dark:border-white/70 bg-transparent"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-1 space-y-6">
                                  {/* Optional Display Name Field */}
                                  <FormField
                                    control={form.control}
                                    name={`resources.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                          Display Name (Optional)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="e.g. Assignment Brief PDF"
                                            {...field}
                                            value={field.value || ""}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {/* File Upload Field */}
                                  <FormField
                                    control={form.control}
                                    name={`resources.${index}.file`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                          File
                                        </FormLabel>
                                        <FormControl>
                                          <div className="w-full flex flex-col items-start mx-auto justify-between gap-1.5 md:flex-row md:items-center">
                                            {field.value?.name ? (
                                              <span className="text-sm w-full text-muted-foreground">
                                                {field.value.name}
                                              </span>
                                            ) : typeof resource.file ===
                                              "string" ? (
                                              <a
                                                href={resource.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 w-full text-nowrap hover:underline text-sm flex items-center gap-2"
                                              >
                                                {resource.name ||
                                                  "View current file"}
                                                <FaDownload />
                                              </a>
                                            ) : null}
                                            <Input
                                              type="file"
                                              className="cursor-pointer w- lg:w-44"
                                              onChange={(e) => {
                                                const file =
                                                  e.target.files?.[0];
                                                if (file) {
                                                  field.onChange(file);
                                                }
                                              }}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const currentResources =
                                      form.getValues("resources") || [];
                                    form.setValue(
                                      "resources",
                                      currentResources.filter(
                                        (_, i) => i !== index
                                      )
                                    );
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() =>
                              form.setValue("resources", [
                                ...(form.watch("resources") || []),
                                { name: "", file: null },
                              ])
                            }
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 py-6 bg-blue-700 hover:bg-blue-600 text-white cursor-pointer font-medium flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <div className="bg-gray-200 w-full py-6 px-4 m-6 mx-auto space-y-6 dark:bg-transparent">
              {/* First Card */}
              <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
                {/* Assignment Title */}
                <h1 className="text-xl font-bold mb-12">
                  {selectedAssignment.title}
                </h1>

                {/* Due Date and Course */}
                <div className="flex flex-col gap-8 justify-between lg:items-stretch mb-18 lg:gap-8 lg:mx-auto lg:flex-row">
                  <div className="w-full flex flex-col justify-between gap-2">
                    <p className="text-lg font-semibold">Due Date:</p>
                    <p className="px-2 text-muted-foreground">
                      {formatDueDate(selectedAssignment.dueDate)} (
                      {calculateDueIn(selectedAssignment.dueDate)})
                    </p>
                    <hr className="border-t border-gray-300 mt-2" />
                  </div>
                  <div className="w-full flex flex-col justify-between gap-2">
                    <p className="text-lg font-semibold">Course:</p>
                    <p className="px-2 text-muted-foreground">
                      {selectedAssignment.course}
                    </p>
                    <hr className="border-t border-gray-300 mt-2" />
                  </div>
                </div>

                {/* Lecturer and Question */}
                <div className="flex flex-col gap-8 justify-between lg:items-stretch lg:gap-8 lg:mx-auto lg:flex-row">
                  <div className="w-full flex flex-col justify-between gap-3">
                    <p className="text-lg font-semibold">Lecturer:</p>
                    <div className="flex px-2 items-center gap-2">
                      <Image
                        src={selectedAssignment.lecturer?.avatar || avatar}
                        alt={
                          selectedAssignment.lecturer?.fullName ||
                          "Lecturer's avatar"
                        }
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        {selectedAssignment.lecturer?.fullName}
                      </p>
                    </div>
                    <hr className="border-t border-gray-300 mt-2" />
                  </div>
                  <div className="w-full flex flex-col justify-between gap-2">
                    <p className="text-lg font-semibold">Question:</p>
                    <p className="px-2 text-muted-foreground">
                      {selectedAssignment.question}
                    </p>
                    <hr className="border-t border-gray-300 mt-2" />
                  </div>
                </div>
              </div>

              {/* Second Card */}
              <div className="bg-white dark:bg-bg2 p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Attached Resources</h2>
                {selectedAssignment.resources &&
                selectedAssignment.resources.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {selectedAssignment.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-100 dark:bg-transparent dark:border-2 dark:border-dashed p-4 rounded-md"
                      >
                        <div className="flex items-center gap-4">
                          <FaFileAlt className="text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">
                              {resource.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(resource?.fileSize ?? 0)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-blue-500 hover:text-blue-400 cursor-pointer"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No resources attached to this assignment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="w-full px-3 flex gap-6 justify-between mx-auto items-center">
            <h1 className="font-semibold text-lg text-start md:text-2xl">
              Assignments
            </h1>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer px-4 py-2 rounded-sm"
            >
              + Create New Assignment
            </Button>
          </div>
          <div className="flex w-full justify-center items-center mx-auto p-3">
            <AssignmentCards
              data={assignments}
              onViewDetails={(assignment) => setSelectedAssignment(assignment)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
