// schemas/gradingInfo.js
import { defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons";

export const gradingType = defineType({
  name: "grading",
  title: "Grading & Feedback",
  type: "document",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "submission", // THE KEY LINK
      title: "Student Submission",
      type: "reference",
      to: [{ type: "studentSubmission" }],
      description: "The student submission being graded.",
      validation: (Rule) => Rule.required(),
      options: {
        disableNew: true,
        // You might want to filter this list to only show ungraded submissions
        // for the current lecturer's assignments. This can get complex.
      },
      // This reference makes this gradingInfo unique to one submission.
      // You can enforce uniqueness on this field in Sanity if a submission should only be graded once.
      // validation: Rule => Rule.required().custom(async (value, context) => {
      //   if (!value || !value._ref) return true;
      //   const {getClient, document} = context;
      //   const client = getClient({apiVersion: '2022-12-07'});
      //   const currentDocumentId = document._id;
      //   const query = `count(*[_type == "gradingInfo" && submission._ref == $submissionRef && _id != $currentDocumentId])`;
      //   const params = { submissionRef: value._ref, currentDocumentId: currentDocumentId || '' };
      //   const count = await client.fetch(query, params);
      //   return count > 0 ? 'This submission has already been graded.' : true;
      // })
    }),
    defineField({
      name: "lecturer",
      title: "Lecturer",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        filter: 'role == "lecturer"',
      },
      description: "The lecturer grading the submission.",
      validation: (Rule) => Rule.required(),
      //readOnly: true, // Typically set to the lecturer doing the grading
    }),
    defineField({
      name: "score",
      title: "Score Awarded",
      type: "number",
      // validation: Rule => Rule.required().min(0).max(ASSIGNMENT_TOTAL_MARKS)
      // Max score could potentially be fetched from the linked assignment.
    }),
    defineField({
      name: "maxscore",
      title: "Maximun Score Possible",
      type: "number",
      // validation: Rule => Rule.required().min(0).max(ASSIGNMENT_TOTAL_MARKS)
      // Max score could potentially be fetched from the linked assignment.
    }),
    defineField({
      name: "feedback",
      title: "Feedback",
      type: "text", // Or 'blockContent' for rich text
      description: "Feedback provided by the lecturer.",
      //validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gradedAt",
      title: "Graded Date",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    // defineField({
    //   name: "gradeStatus",
    //   title: "Grade Status",
    //   type: "string",
    //   options: {
    //     list: [
    //       { title: "Successfully Graded", value: "graded-successful" },
    //       { title: "Needs Revision", value: "needs-revision" },
    //       // ... other statuses
    //     ],
    //   },
    //   initialValue: "graded-successful",
    //   validation: (Rule) => Rule.required(),
    // }),
  ],
  preview: {
    select: {
      submissionStudentName: "submission.student.name",
      submissionAssignmentTitle: "submission.assignment.title",
      score: "score",
      lecturer: "lecturer.name",
      status: "gradeStatus",
    },
    prepare(selection) {
      const {
        submissionStudentName,
        submissionAssignmentTitle,
        score,
        lecturer,
        status,
      } = selection;
      return {
        title: `Grade for: ${submissionStudentName || "N/A"} - ${submissionAssignmentTitle || "N/A"}`,
        subtitle: `Score: ${score !== undefined ? score : "N/A"} by ${lecturer || "Grader N/A"} (${status || ""})`,
      };
    },
  },
});
