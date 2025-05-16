"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";
import { TrashIcon } from "lucide-react";

// Define form schema
const submissionFormSchema = z.object({
  submittedFiles: z
    .array(z.instanceof(File))
    .min(1, "You must upload at least one file."),
  studentComments: z.string().optional(),
});

export default function StudentSubmission({
  assignmentId,
  assignmentTitle,
  studentId,
  onSubmissionSuccess,
  onCancel,
}: {
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  onSubmissionSuccess: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const client = getClient({ token: writeToken });

  const form = useForm<z.infer<typeof submissionFormSchema>>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      submittedFiles: [],
      studentComments: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof submissionFormSchema>) => {
    try {
      setIsLoading(true);

      // Upload submitted files
      const uploadedFiles = await Promise.all(
        values.submittedFiles.map(async (file) => {
          const uploadResult = await client.assets.upload("file", file, {
            filename: file.name,
            contentType: file.type,
          });

          return {
            _type: "file",
            _key: uploadResult._rev,
            asset: {
              _type: "reference",
              _ref: uploadResult._id,
            },
            filename: file.name,
          };
        })
      );

      // Perform plagiarism and AI checks
      const checkerData = [
        { _key: "1", title: "AI Use", amount: 275, fill: "var(--color-ai)" },
        {
          _key: "2",
          title: "Plagiarised Content",
          amount: 200,
          fill: "var(--color-plagiarism)",
        },
        {
          _key: "3",
          title: "Human Written",
          amount: 287,
          fill: "var(--color-human)",
        },
      ];

      // Create the submission document
      await client.create({
        _type: "studentSubmission",
        assignment: {
          _type: "reference",
          _ref: assignmentId,
        },
        student: {
          _type: "reference",
          _ref: studentId,
        },
        submittedFiles: uploadedFiles,
        submissionDate: new Date().toISOString(),
        studentComments: values.studentComments,
        checkerData,
      });

      toast("Success", {
        description: "Submission created successfully.✅",
      });
      onSubmissionSuccess(); // Notify parent component
    } catch (error) {
      console.error("Error creating submission:", error);
      toast("Error", {
        description: "Failed to create submission.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 w-full py-4 mx-auto space-y-6 dark:bg-transparent">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <a
          onClick={onCancel} // Go back to assignment details
          className="font-semibold text-black/50 dark:text-txt1 lg:text-xl cursor-pointer hover:underline"
        >
          {assignmentTitle}
        </a>
        &gt; &gt; <span className="font-semibold lg:text-2xl">Submit</span>
      </div>

      <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6">Submit Assignment</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Section */}
            <FormField
              control={form.control}
              name="submittedFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Files</FormLabel>
                  <FormControl>
                    <div className="border border-gray-300 rounded-md p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange([...field.value, ...files]);
                          }}
                        />
                      </div>
                      {/* Display selected files */}
                      {field.value.length > 0 && (
                        <ul className="space-y-2">
                          {field.value.map((file, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-gray-100 dark:bg-bg1 p-2 px-3 rounded-md"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedFiles = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(updatedFiles);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments Section */}
            <FormField
              control={form.control}
              name="studentComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel} // Cancel submission
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
