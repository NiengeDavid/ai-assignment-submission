import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const levelType = defineType({
  name: "level",
  title: "Level",
  type: "document",
  icon: BlockElementIcon,
  fields: [
    defineField({ name: "level", type: "string" }),
    defineField({ name: "code", type: "string" }),
  ],
});
