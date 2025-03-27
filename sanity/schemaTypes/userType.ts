// schemas/user.ts
import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true
    }),

    defineField({
      name: "fullName",
      title: "Official Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "User Role",
      type: "string",
      options: {
        list: [
          { title: "Super Admin", value: "superAdmin" },
          { title: "Admin", value: "admin" },
          { title: "Lecturer", value: "lecturer" },
          { title: "Student", value: "student" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.email().required(),
        }),
        defineField({
          name: "phoneNumber",
          title: "Phone Number",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "academic",
      title: "Academic Information",
      type: "object",
      hidden: ({ document }) => document?.role === "superAdmin",
      fields: [
        defineField({
          name: "faculty",
          title: "Faculty",
          type: "reference",
          to: [{ type: "faculty" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "department",
          title: "Department",
          type: "reference",
          to: [{ type: "department" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "level",
          title: "Level",
          type: "string",
          hidden: ({ parent }) => parent?.role !== "student",
          options: {
            list: ["100", "200", "300", "400", "500"].map((level) => ({
              title: `${level} Level`,
              value: level,
            })),
          },
          validation: (Rule) => Rule.custom((value, context) => {
            if ((context.parent as { role?: string })?.role === "student" && !value) {
              return "Level is required for students";
            }
            return true;
          }),
        }),
        defineField({
          name: "regNumber",
          title: "Registration Number",
          type: "string",
          hidden: ({ parent }) => parent?.role !== "student",
          validation: (Rule) => Rule.custom((value, context) => {
            if ((context.parent as { role?: string })?.role === "student" && !value) {
              return "Registration number is required for students";
            }
            return true;
          }),
        }),
        defineField({
          name: "staffId",
          title: "Staff ID",
          type: "string",
          hidden: ({ parent }) => parent?.role === "student",
          validation: (Rule) => Rule.custom((value, context) => {
            if (["admin", "lecturer"].includes((context.parent as { role?: string })?.role ?? "") && !value) {
              return "Staff ID is required for staff members";
            }
            return true;
          }),
        }),
      ],
    }),

    defineField({
      name: "authStatus",
      title: "Authentication Status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Verified", value: "verified" },
          { title: "Pending", value: "pending" }
        ]
      },
      initialValue: "pending"
    }),

    // defineField({
    //   name: "bio",
    //   title: "Biography",
    //   type: "array",
    //   hidden: ({ document }) => document?.role === "student",
    //   of: [
    //     defineArrayMember({
    //       type: "block",
    //       styles: [{ title: "Normal", value: "normal" }],
    //       lists: [],
    //       marks: {
    //         decorators: [
    //           { title: "Strong", value: "strong" },
    //           { title: "Emphasis", value: "em" },
    //         ],
    //       },
    //     }),
    //   ],
    // }),
  ],

  preview: {
    select: {
      title: "fullName",
      subtitle: "role",
      media: "image",
      status: "authStatus"
    },
    prepare(selection) {
      const { title, subtitle, media, status } = selection;
      return {
        title,
        subtitle: `${subtitle.charAt(0).toUpperCase()}${subtitle.slice(1)} • ${status.charAt(0).toUpperCase()}${status.slice(1)}`,
        media,
      };
    },
  },
});