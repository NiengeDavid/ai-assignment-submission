// schemas/department.js
import { InlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const departmentType = defineType({
  name: "department",
  title: "Department",
  type: "document",
  icon: InlineIcon,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "code", type: "string" }),
    defineField({
      name: "faculty",
      type: "reference",
      to: [{ type: "faculty" }],
    }),
  ],
});
