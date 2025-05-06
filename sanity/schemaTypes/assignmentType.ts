// schemas/assignment.js
import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const assignmentType = defineType({
  name: "assignment",
  title: "Assignment",
  type: "document",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Assignment Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "assignmentId",
      title: "Assignment ID",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "string", // Or reference to a 'course' schema
      description: "E.g., SEN401 - Software Engineering Economics",
    }),
    defineField({
      name: "lecturer", // The creator of the assignment
      title: "Lecturer",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        filter: 'role == "lecturer"',
      },
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "department",
      title: "Target Department",
      type: "reference", // <--- MODIFIED HERE
      to: [{ type: "department" }], // Assumes your department schema is named 'department'
      validation: (Rule) => Rule.required(),
      description: "Department this assignment is for.",
    }),
    defineField({
      name: "level",
      title: "Target Level",
      type: "string", // <--- MODIFIED HERE
      options: {
        // <--- ADDED OPTIONS
        list: [
          { title: "100 Level", value: "100" },
          { title: "200 Level", value: "200" },
          { title: "300 Level", value: "300" },
          { title: "400 Level", value: "400" },
          // Add other levels like "Masters", "PhD" if needed
        ],
        layout: "radio", // Or 'dropdown'
      },
      validation: (Rule) => Rule.required(),
      description: "Select the level this assignment is for.",
      // If an assignment can target MULTIPLE levels, you would use:
      // type: 'array',
      // of: [{
      //   type: 'string',
      //   options: {
      //     list: [
      //       { title: '100 Level', value: '100' },
      //       { title: '200 Level', value: '200' },
      //       { title: '300 Level', value: '300' },
      //       { title: '400 Level', value: '400' },
      //     ]
      //   }
      // }],
      // validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "dueDate",
      title: "Due Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "question",
      title: "Assignment Question / Description",
      type: "text", // Or 'blockContent' for rich text
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "displayName",
              title: "Display Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "file",
              title: "File",
              type: "file",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            // Custom preview for resource objects in the array
            select: {
              title: "displayName",
              subtitle: "file.asset.originalFilename",
              file: "file", // Include 'file' in the select object
            },
            prepare({ title, subtitle, file }) {
              return {
                title: title,
                subtitle:
                  subtitle ||
                  (file?.asset?.originalFilename
                    ? `(${file.asset.originalFilename})`
                    : "(File not yet uploaded)"),
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      course: "course",
      lecturerName: "lecturer.name",
      departmentName: "department.name", // Assuming your department schema has a 'name' field for preview
      level: "level",
    },
    prepare(selection) {
      const { title, course, lecturerName, departmentName, level } = selection;
      const levelDisplay = level ? `${level} Level` : "N/A";
      return {
        title: `${title} (${course || "N/A"})`,
        subtitle: `For: ${departmentName || "N/A Dept."} - ${levelDisplay} (By: ${lecturerName || "N/A"})`,
      };
    },
  },
});
