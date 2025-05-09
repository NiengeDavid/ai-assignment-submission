import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { readToken } from "@/sanity/lib/sanity.api";
import { getClient, getUserById } from "@/sanity/lib/sanity.client";

const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  // Add other protected routes here
]);

export default clerkMiddleware(async (auth, req) => {
  // Debug logging
  console.log(`Middleware processing: ${req.nextUrl.pathname}`);

  // Skip middleware for public routes
  if (!protectedRoutes(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Redirect unauthenticated users to login
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Fetch user role from Sanity
  const client = getClient({ token: readToken });
  let role = null;

  try {
    const fetchedUser = await getUserById(client, userId);
    role = fetchedUser?.role;
    //console.log(`User ${userId} has role: ${role}`);
  } catch (err) {
    console.error("Error fetching user role:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Handle root dashboard path
  if (req.nextUrl.pathname === "/dashboard") {
    const redirectPath = `/dashboard/${role}`;
    console.log(`Redirecting to role-specific dashboard: ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Validate role access to specific dashboard paths
  const pathSegments = req.nextUrl.pathname.split("/");
  const dashboardRoleSegment = pathSegments[2]; // /dashboard/[role]/...

  if (dashboardRoleSegment && dashboardRoleSegment !== role) {
    console.log(
      `Unauthorized access attempt to ${req.nextUrl.pathname} by role ${role}`
    );
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard",
    "/dashboard/:path*",
    // Add other protected routes here
  ],
};
