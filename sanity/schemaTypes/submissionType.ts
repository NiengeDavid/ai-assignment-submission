// schemas/studentSubmission.js
import { defineField, defineType } from "sanity";
import { UploadIcon } from "@sanity/icons";

export const submissionType = defineType({
  name: "studentSubmission",
  title: "Student Submission",
  type: "document",
  icon: UploadIcon,
  fields: [
    defineField({
      name: "assignment",
      title: "Assignment",
      type: "reference",
      to: [{ type: "assignment" }],
      validation: (Rule) => Rule.required(),
      options: { disableNew: true }, // Don't allow creating new assignments from here
    }),
    defineField({
      name: "student",
      title: "Student",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        filter: 'role == "student"', // Only allow selecting students
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
      readOnly: true, // Should be set to the current student submitting
    }),
    defineField({
      name: "submittedFiles",
      title: "Submitted Files",
      type: "array",
      of: [{ type: "file" }],
      validation: (Rule) => Rule.required().min(1), // Must submit at least one file
    }),
    defineField({
      name: "submissionDate",
      title: "Submission Date",
      type: "datetime",
      readOnly: true, // Set automatically on creation
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "studentComments",
      title: "Student Comments",
      type: "text",
      description:
        "Optional comments from the student regarding their submission.",
    }),
    // You could add a 'status' field here if submissions go through a workflow
    // e.g., 'Submitted', 'Late Submission', 'Resubmitted'
  ],
  preview: {
    select: {
      assignmentTitle: "assignment.title",
      studentName: "student.name",
      submissionDate: "submissionDate",
      fileCount: "submittedFiles.length",
    },
    prepare(selection) {
      const { assignmentTitle, studentName, submissionDate, fileCount } =
        selection;
      const date = submissionDate
        ? new Date(submissionDate).toLocaleDateString()
        : "No date";
      return {
        title: `Submission for: ${assignmentTitle || "N/A"}`,
        subtitle: `By: ${studentName || "N/A"} on ${date} (${fileCount || 0} files)`,
      };
    },
  },
  // Consider adding a Sanity validation rule for compound uniqueness if possible,
  // to prevent a student from submitting more than once for the same assignment.
  // This is complex for references and often better handled by application logic.
  // Example (conceptual, might need a custom async validator for references):
  // validation: Rule => Rule.custom(async (fields, context) => {
  //   const {getClient} = context;
  //   const client = getClient({apiVersion: '2022-12-07'});
  //   const {assignment, student} = fields;
  //   if (!assignment?._ref || !student?._ref) return true; // If not set, pass

  //   const existing = await client.fetch(
  //     `*[_type == "studentSubmission" &&
  //        assignment._ref == $assignmentId &&
  //        student._ref == $studentId &&
  //        _id != $currentId // Exclude current document if editing
  //       ]`,
  //     { assignmentId: assignment._ref, studentId: student._ref, currentId: context.document._id || '' }
  //   );
  //   return existing.length === 0 ? true : "This student has already submitted for this assignment.";
  // })
});
