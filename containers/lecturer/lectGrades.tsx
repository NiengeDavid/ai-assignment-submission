import { useEffect, useState } from "react";
import {
  getLecturerSubmittedAssignments,
  getSubmittedAssignments,
} from "@/sanity/lib/sanity.client";
import { getClient } from "@/sanity/lib/sanity.client";
import { readToken } from "@/sanity/lib/sanity.api";
import { useUser } from "@clerk/nextjs";
import LectDataTable from "./gradingTable";
import GradingSheet from "./gradingSheet";

export default function GradingTab() {
  const client = getClient({ token: readToken });
  const [submittedAssignments, setSubmittedAssignments] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const userId = user?.id;
  const lecturerId = `user-${userId}`;

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      setIsLoading(true);
      try {
        const data = await getLecturerSubmittedAssignments(client, lecturerId);

        setSubmittedAssignments(data);
        console.log("Submitted Assignments:", data);
      } catch (error) {
        console.error("Error fetching submitted assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmittedAssignments();
  }, [lecturerId]);

  const handleGradingSubmit = async (grade: number, feedback: string) => {
    // Handle grading submission logic here
    console.log("Grading Submitted:", { grade, feedback });
    // Update the submission in the state
    setSubmittedAssignments((prev) =>
      prev.map((submission) =>
        submission._id === selectedSubmission._id
          ? { ...submission, grade, feedback, status: "graded" }
          : submission
      )
    );

    setSelectedSubmission(null); // Close the grading sheet after submission
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : selectedSubmission ? (
        <GradingSheet
          submission={selectedSubmission}
          onSubmit={handleGradingSubmit}
          onCancel={() => setSelectedSubmission(null)}
        />
      ) : (
        <LectDataTable
          data={submittedAssignments}
          onViewDetails={(submission) => setSelectedSubmission(submission)}
        />
      )}
    </div>
  );
}
