import { groq } from "next-sanity";

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`;

// export const settingsQuery = groq`*[_type == "settings"][0]`;

export const facultyQuery = groq`
*[_type == "faculty"] | order(_updatedAt desc)`;

export const departmentQuery = groq`
*[_type == "department"] | order(_updatedAt desc)`;

export const assignmentQuery = groq`*[_type == "assignment"]{
  _id,
  _createdAt,
  title,
  assignmentId,
  course,
  "image": image.asset->url,
  "lecturer": lecturer->{
    _id,
    fullName,
    "avatar": image.asset->url
  },
  "department": department->{
    _id,
    name
  },
  level,
  dueDate,
  question,
  resources[]{
    displayName,
    "fileUrl": file.asset->url,
    "fileName": file.asset->originalFilename, // Missing comma added here
    "fileSize": file.asset->size
  }
}`;

export const userbyIdQuery = groq`
  *[_type == "user" && userId == $userId][0]{
    userId,
    role,
  }
`;

// export const indexQuery = groq`
// *[_type == "post"] | order(date desc, _updatedAt desc) {
//   ${postFields}
// }`;

// export const postAndMoreStoriesQuery = groq`
// {
//   "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
//     content,
//     ${postFields}
//   },
//   "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
//     content,
//     ${postFields}
//   }
// }`;

// export const postSlugsQuery = groq`
// *[_type == "post" && defined(slug.current)][].slug.current
// `;

// export const postBySlugQuery = groq`
// *[_type == "post" && slug.current == $slug][0] {
//   ${postFields}
// }
// `;

// export interface Author {
//   name?: string;
//   picture?: any;
// }

// export interface Post {
//   _id: string;
//   title?: string;
//   coverImage?: any;
//   date?: string;
//   _updatedAt?: string;
//   excerpt?: string;
//   author?: Author;
//   slug?: string;
//   content?: any;
// }

// export interface Settings {
//   title?: string;
//   description?: any[];
//   ogImage?: {
//     title?: string;
//   };
// }

export interface Department {
  _id: string;
  name?: string;
  code?: string;
  faculty?: string;
}

export interface Faculty {
  _id: string;
  name?: string;
  code?: string;
}

export interface Assignment {
  _id: string;
  _createdAt: string;
  title: string;
  assignmentId: string;
  course: string;
  image?: string; // URL of the assignment cover image
  lecturer?: {
    _id: string;
    fullName: string;
    avatar?: string; // URL of the lecturer's avatar
  };
  department?: {
    _id: string;
    name: string;
  };
  level: string; // e.g., "100", "200", "300", "400"
  dueDate: string; // ISO date string
  question: string; // Assignment question or description
  resources: {
    displayName: string;
    fileUrl: string; // URL of the file
    fileName: string; // Original filename of the file
    fileSize?: number;
  }[];
}

export interface User {
  _id: string;
  role: string;
}
