"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";
import { uploadFileToSanity } from "@/sanity/lib/sanity.client";

// Define form schema
const assignmentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: z.string().min(1, "Course is required"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format",
  }),
  question: z.string().min(1, "Question is required"),
  department: z.string().min(1, "Department is required"),
  level: z.string().min(1, "Level is required"),
  image: z.instanceof(File).optional(),
  resources: z.array(
    z.object({
      name: z.string().min(1, "Display name is required"),
      file: z.instanceof(File).nullable(),
    })
  ),
});

export default function CreateAssignment({
  departments,
  lecturerId,
  onCancel,
  onAssignmentCreated,
}: {
  departments: { _id: string; name: string }[];
  lecturerId: string;
  onCancel: () => void;
  onAssignmentCreated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const client = getClient({ token: writeToken });

  const form = useForm<z.infer<typeof assignmentFormSchema>>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      course: "",
      dueDate: "",
      question: "",
      department: "",
      level: "",
      resources: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof assignmentFormSchema>) => {
    try {
      setIsLoading(true);

      // Upload cover image if exists
      let imageAsset;
      if (values.image) {
        const uploadResult = await client.assets.upload("image", values.image);
        imageAsset = {
          _id: uploadResult._id,
          url: uploadResult.url,
        };
      }

      // Upload resource files
      const resources = await Promise.all(
        values.resources.map(async (resource) => {
          if (!resource.file) return null;

          const uploadResult = await client.assets.upload(
            "file",
            resource.file
          );
          return {
            displayName: resource.name,
            file: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: uploadResult._id, // Use the document ID
              },
            },
          };
        })
      );

      // Filter out any null resources
      const validResources = resources.filter(Boolean);

      // Create the assignment document
      await client.create({
        _type: "assignment",
        title: values.title,
        course: values.course,
        dueDate: new Date(values.dueDate).toISOString(),
        question: values.question,
        lecturer: {
          _type: "reference",
          _ref: lecturerId,
        },
        department: {
          _type: "reference",
          _ref: values.department,
        },
        level: values.level,
        image: imageAsset
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAsset._id, // Use the document ID
              },
            }
          : undefined,
        resources: validResources,
      });

      toast("Success", {
        description: "Assignment created successfully",
      });
      onAssignmentCreated();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast("Error", {
        description: "Failed to create assignment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 w-full px-4 mx-auto space-y-6 dark:bg-transparent">
      <h1 className="text-2xl font-bold mb-6">Create New Assignment</h1>
      <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              new Date(e.target.value).toISOString()
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
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
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-bg1">
                          {departments.map((dept) => (
                            <SelectItem key={dept._id} value={dept._id}>
                              {dept.name}
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
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-bg1">
                          <SelectItem value="100">100 Level</SelectItem>
                          <SelectItem value="200">200 Level</SelectItem>
                          <SelectItem value="300">300 Level</SelectItem>
                          <SelectItem value="400">400 Level</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Resources */}
              <div className="flex-1 space-y-4">
                <FormLabel>Resources</FormLabel>
                {form.watch("resources")?.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <FormField
                      control={form.control}
                      name={`resources.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`resources.${index}.file`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const currentResources = form.getValues("resources");
                        form.setValue(
                          "resources",
                          currentResources.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
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

            <div className="flex  justify-start gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel} // Call onCancel to go back
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-bg2 text-white dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Publish Assignment
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
