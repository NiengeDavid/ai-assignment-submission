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

export const filteredAssignmentsQuery = groq`
  *[_type == "assignment" && department._ref == $departmentId && level == $level] {
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
      "fileName": file.asset->originalFilename,
      "fileSize": file.asset->size
    }
  }
`;

// Query to fetch student details (department and level)
export const studentDetailsQuery = groq`
  *[_type == "user" && userId == $userId && role == "student"][0] {
    _id,
    userId,
    fullName,
    "email": contact.email,
    role,
    "image": image.asset->url,
    "department": academic.department->{
      _id,
      name
    },
    "faculty": academic.faculty->{
      _id,
      name
    },
    "level": academic.level,
    "regNumber": academic.regNumber,
    createdAt,
    updatedAt
  }
`;

export const userbyIdQuery = groq`
  *[_type == "user" && userId == $userId][0]{
    userId,
    role,
  }
`;

export const submittedAssignmentsQuery = groq`
  *[_type == "studentSubmission" && student._ref == $studentId] {
   "assignmentId": assignment->_id,
   status
  }
`;

export const lecturerSubmittedAssignmentsQuery = groq`
  *[_type == "studentSubmission" && assignment->lecturer._ref == $lecturerId] {
    _id,
    "assignmentId": assignment->_id,
    "assignmentTitle": assignment->title,
    "studentId": student->academic.regNumber, // Fixed path for studentId
    "studentName": student->fullName,
    "course": assignment->course,
    "department": assignment->department->name,
    "level": assignment->level,
    "status": coalesce(status, "pending"), // Default status to "pending" if not set
    gradedAt,
    "submittedAt": _createdAt,
    "assignmentDetails": assignment->{
      _id,
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
        "fileName": file.asset->originalFilename,
        "fileSize": file.asset->size
      }
    }
  }
`;

export const lecturerAssignmentsQuery = groq`
  *[_type == "assignment" && lecturer._ref == $lecturerId] {
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
      "fileName": file.asset->originalFilename,
      "fileSize": file.asset->size
    }
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

export interface SubmittedAssignment {
  assignment: string; // The ID of the submitted assignment
}

// Type for the student details query result
export interface SanityReference {
  _ref: string;
  _type: "reference";
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  // Add other asset fields if needed
}

// export interface Department {
//   _id: string;
//   name: string;
// }

// export interface Faculty {
//   _id: string;
//   name: string;
// }

export interface StudentDetails {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  image?: string;
  department: {
    _id: string;
    name: string;
  };
  faculty: {
    _id: string;
    name: string;
  };
  level: string;
  regNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmittedAssignments {
  assignmentId: string; // The ID of the submitted assignment
  status: string; // Status of the submission (e.g., "graded", "pending")
}

export interface LecturerSubmittedAssignment {
  _id: string; // The ID of the submission
  assignmentId: string; // The ID of the associated assignment
  assignmentTitle: string; // The title of the associated assignment
  studentId: string; // The ID of the student who submitted the assignment
  studentName: string; // The full name of the student
  course: string; // The course associated with the assignment
  department: string; // The department associated with the assignment
  level: string; // The academic level of the assignment
  status: string; // The status of the submission (e.g., "graded", "pending")
  gradedAt?: string; // The date and time the submission was graded
  submittedAt: string; // The date and time the submission was created
  assignmentDetails: {
    _id: string;
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
  };
}
