import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from "@/sanity/lib/sanity.api";
import {
  type Assignment,
  assignmentQuery,
  // indexQuery,
  // type Post,
  // postAndMoreStoriesQuery,
  // postBySlugQuery,
  // postSlugsQuery,
  // type Settings,
  // settingsQuery,
  departmentQuery,
  facultyQuery,
  type Department,
  type Faculty,
  type User,
  userbyIdQuery,
  SubmittedAssignment,
  submittedAssignmentsQuery,
  filteredAssignmentsQuery,
  type StudentDetails,
  studentDetailsQuery,
  SubmittedAssignments,
  lecturerAssignmentsQuery,
} from "@/sanity/lib/sanity.queries";
import { createClient, type SanityClient } from "next-sanity";

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
  });

  // If preview is provided and has a token, return a client with the token
  if (preview?.token) {
    return client.withConfig({
      token: preview.token,
    });
  }

  // Otherwise, return the default client
  return client;
}

export const getSanityImageConfig = () => getClient();

export async function getAllDepartments(
  client: SanityClient
): Promise<Department[]> {
  return (await client.fetch(departmentQuery)) || [];
}

export async function getAllFaculties(
  client: SanityClient
): Promise<Faculty[]> {
  return (await client.fetch(facultyQuery)) || [];
}

export async function getAllAssignment(
  client: SanityClient
): Promise<Assignment[]> {
  return (await client.fetch(assignmentQuery)) || [];
}

export async function getUserById(
  client: SanityClient,
  userId: string
): Promise<User> {
  return (await client.fetch(userbyIdQuery, { userId })) || ({} as any);
}

export async function deleteAssignment(client: SanityClient, id: string) {
  return client.delete(id);
}

export async function uploadFileToSanity(
  client: SanityClient,
  file: File
): Promise<{ url: string; originalFilename: string; size: number }> {
  try {
    // Check if the file exists
    if (!file) {
      throw new Error("No file provided");
    }

    // Upload the file to Sanity
    const result = await client.assets.upload("file", file, {
      filename: file.name,
      contentType: file.type,
    });

    return {
      url: result.url,
      originalFilename: result.originalFilename || file.name,
      size: result.size,
    };
  } catch (error) {
    console.error("Error uploading file to Sanity:", error);
    throw error;
  }
}

export async function updateAssignmentWithResources(
  client: SanityClient,
  assignmentId: string,
  values: any
) {
  try {
    // Process resources - upload new files if needed
    const resources = await Promise.all(
      (values.resources || []).map(async (resource: any) => {
        // If resource.file is already a URL (existing file), keep it
        if (typeof resource.file === "string") {
          return {
            fileName: resource.name || resource.file.split("/").pop(),
            fileUrl: resource.file,
            fileSize: 0, // We don't have size for existing files
          };
        }

        // If resource.file is a File object, upload it
        if (resource.file instanceof File) {
          const uploadedFile = await uploadFileToSanity(client, resource.file);
          return {
            fileName: resource.name || uploadedFile.originalFilename,
            fileUrl: uploadedFile.url,
            fileSize: uploadedFile.size,
          };
        }

        return [];
      })
    );

    // Filter out any null resources
    const filteredResources = resources.filter(Boolean);

    // Prepare the assignment data for update
    const assignmentData = {
      ...values,
      resources: filteredResources,
    };

    // Update the assignment in Sanity
    return await client.patch(assignmentId).set(assignmentData).commit();
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
}

export const getSubmittedAssignments = async (
  client: SanityClient,
  studentId: string
): Promise<SubmittedAssignments[]> => {
  const submittedAssignments = await client.fetch(submittedAssignmentsQuery, {
    studentId,
  });
  return submittedAssignments.map((submission: SubmittedAssignments) => ({
    assignmentId: submission.assignmentId,
    status: submission.status,
  }));
};

export const getFilteredAssignments = async (
  client: SanityClient,
  departmentId: string,
  level: string
): Promise<Assignment[]> => {
  return await client.fetch(filteredAssignmentsQuery, {
    departmentId,
    level,
  });
};

export async function getStudentDetails(
  client: SanityClient,
  userId: string
): Promise<StudentDetails | null> {
  try {
    const student = await client.fetch<StudentDetails>(studentDetailsQuery, {
      userId,
    });
    return student || null;
  } catch (error) {
    console.error("Error fetching student details:", error);
    return null;
  }
}

export const getLecturerAssignments = async (
  client: SanityClient,
  lecturerId: string
): Promise<Assignment[]> => {
  return await client.fetch(lecturerAssignmentsQuery, { lecturerId });
};
//   export async function getSettings(client: SanityClient): Promise<Settings> {
//     return (await client.fetch(settingsQuery)) || {}
//   }

//   export async function getAllPosts(client: SanityClient): Promise<Post[]> {
//     return (await client.fetch(indexQuery)) || []
//   }

//   export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
//     const client = getClient()
//     const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
//     return slugs.map((slug) => ({ slug }))
//   }

//   export async function getPostBySlug(
//     client: SanityClient,
//     slug: string,
//   ): Promise<Post> {
//     return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
//   }

//   export async function getPostAndMoreStories(
//     client: SanityClient,
//     slug: string,
//   ): Promise<{ post: Post; morePosts: Post[] }> {
//     return await client.fetch(postAndMoreStoriesQuery, { slug })
//   }
