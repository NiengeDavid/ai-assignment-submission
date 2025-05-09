"use client";

import { useParams } from "next/navigation";
import StudentDashboardPage from "@/containers/student/dashboard";
import LecturerDashboardPage from "@/containers/lecturer/dashboard";
import AdminDashboardPage from "@/containers/admin/dashboard";
import SuperAdminDashboardPage from "@/containers/superAdmin/dashboard";

export default function Dashboard() {
  const { role } = useParams(); // Get the role from the URL path

  if (role === "student") return <StudentDashboardPage />;
  if (role === "lecturer") return <LecturerDashboardPage />;
  if (role === "admin") return <AdminDashboardPage />;
  if (role === "superadmin") return <SuperAdminDashboardPage />;

  return <div>Invalid Role</div>;
}
