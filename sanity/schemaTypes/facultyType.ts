// schemas/faculty.js
import { MasterDetailIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const facultyType = defineType({
  name: "faculty",
  title: "Faculty",
  type: "document",
  icon: MasterDetailIcon,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "code", type: "string" }),
  ],
});
