import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from "@/sanity/lib/sanity.api";
import {
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
