"use client";
import { useState, useEffect } from "react";
import { SectionCards } from "@/components/section-cards";
import { AssignmentCards } from "@/components/assignment-cards";
import { readToken } from "@/sanity/lib/sanity.api";
import { getClient, getAllAssignment } from "@/sanity/lib/sanity.client";
import { type Assignment } from "@/sanity/lib/sanity.queries";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const assignmentsData = await getAllAssignment(client);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching Assignments:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
    // console.log("Departments:", departments);
    // console.log("Faculties:", faculties);
  }, []);

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
      value: "10",
      trendValue: "",
      footerText: "",
      footerDescription: "",
    },
    {
      title: "Upcoming Assignments",
      description: "Upcoming Assignments",
      value: "7",
      trendValue: "",
      footerText: "",
      footerDescription: "",
    },
    {
      title: "Graded Assignments",
      description: "Graded Assignments",
      value: "3",
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
              data={assignments}
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
