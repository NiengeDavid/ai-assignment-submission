import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { facultyType } from "./facultyType";
import { departmentType } from "./departmentType";
import { userType } from "./userType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    facultyType,
    departmentType,
    userType,
  ],
};
