"use client";
import { useState, useEffect } from "react";
import { SectionCards } from "@/components/section-cards";
import { AssignmentCards } from "@/components/assignment-cards";
import { readToken } from "@/sanity/lib/sanity.api";
import {
  getClient,
  getAllAssignment,
  getSubmittedAssignments,
  getStudentDetails,
  getFilteredAssignments,
} from "@/sanity/lib/sanity.client";
import {
  StudentDetails,
  SubmittedAssignments,
  type Assignment,
} from "@/sanity/lib/sanity.queries";
import StudentSubmission from "./studentSubmission";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface DashProps {
  setActiveTab: (tab: string) => void;
  setSelectedAssignment: React.Dispatch<
    React.SetStateAction<Assignment | null>
  >;
}

export default function Dash({
  setActiveTab,
  setSelectedAssignment,
}: DashProps) {
  const client = getClient({ token: readToken });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(
    null
  ); // Track user details
  const [submittedAssignments, setSubmittedAssignments] = useState<
    SubmittedAssignments[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const userId = user?.id || "default-user-id"; // Replace with actual user ID
  const currentUserId = `user-${userId}`; // Example format for current user ID

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const userData = await getStudentDetails(client, userId);
        setStudentDetails(userData);
        // console.log("User Data:", studentDetails);
      } catch (error) {
        toast("Error", {
          description: "Error fetching user data",
        });
        // console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [currentUserId]);

  // Fetch assignments and submitted assignments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        // Fetch assignments filtered by department and level
        if (studentDetails) {
          const [assignmentsData, submittedAssignmentsData] = await Promise.all(
            [
              getFilteredAssignments(
                client,
                studentDetails.department._id, // Use the correct property
                studentDetails.level // Use the correct property
              ),
              getSubmittedAssignments(client, currentUserId),
            ]
          );

          setAssignments(assignmentsData);
          setSubmittedAssignments(submittedAssignmentsData);
          //console.log("Assignments Data:", assignmentsData);
        } else {
          console.warn("Student details are not available.");
        }
      } catch (error) {
        console.error("Error fetching assignments Data:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
  }, [currentUserId, studentDetails, studentDetails]);

  // Filter assignments to exclude submitted ones
  const filteredAssignments = assignments.filter(
    (assignment) =>
      !submittedAssignments.some(
        (submission) => submission.assignmentId === assignment._id
      )
  );

  // Calculate dynamic card data
  const totalAssignments = assignments.length;
  const upcomingAssignments = filteredAssignments.length;
  // Calculate graded assignments
  const gradedAssignments = submittedAssignments.filter(
    (submission) => submission.status === "graded"
  ).length;

  const cardData: {
    title: string;
    description: string;
    value: string;
    trendValue: string;
    footerText: string;
    footerDescription: string;
  }[] = [
    {
      title: "Total Assignments",
      description: "Total Assignments",
      value: totalAssignments.toString(),
      trendValue: "",
      footerText: "",
      footerDescription: "",
    },
    {
      title: "Upcoming Assignments",
      description: "Upcoming Assignments",
      value: upcomingAssignments.toString(),
      trendValue: "",
      footerText: "",
      footerDescription: "",
    },
    {
      title: "Graded Assignments",
      description: "Graded Assignments",
      value: gradedAssignments.toString(),
      trendValue: "",
      footerText: "",
      footerDescription: "",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Assifnments Overview */}
      <div className="bg-gray-200 w-full py-6 px-2 m-6 mx-auto space-y-6 rounded-lg shadow-md dark:bg-bg2">
        <div className="flex flex-col gap-6">
          <h1 className="font-bold text-2xl px-6 text-start">Assignments</h1>
          <SectionCards data={cardData} />
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-transparent w-full py-6 m-6 mx-auto space-y-6">
        <div className="flex flex-col gap-8">
          <div className="w-full px-3 flex gap-6 justify-between mx-auto items-center">
            <h1 className="font-semibold text-lg text-start md:text-2xl">
              Upcoming Assignments
            </h1>
            <button
              onClick={() => setActiveTab("Assignments")}
              className="bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer px-4 py-2 rounded-sm"
            >
              View All
            </button>
          </div>
          <div className="flex w-full justify-center items-center mx-auto p-3">
            <AssignmentCards
              data={filteredAssignments}
              onViewDetails={(assignment) => {
                setSelectedAssignment(assignment); // Set the selected assignment
                setActiveTab("Assignments"); // Switch to the Assignments tab
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
