"use client";

import { usePathname } from "next/navigation";
import HomeNavbar from "@/components/HomeNavbar";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Define public and protected routes
  const publicRoutes = ["/", "/login", "/signup", "verify-email"]; // Add all public routes here
  const protectedRoutes = ["/dashboard"]; // Add all protected routes here

  // Determine which navbar to render based on the route
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  return (
    <>
      {isPublicRoute && <HomeNavbar />}
      {/* {isProtectedRoute && <Navbar />} */}
    </>
  );
}