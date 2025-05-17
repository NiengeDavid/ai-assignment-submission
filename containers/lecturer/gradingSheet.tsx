"use client";

import { useState } from "react";
import Image from "next/image";
import { Pie, PieChart, Label } from "recharts";
import { useUser } from "@clerk/nextjs";

// Add the following interfaces at the top of the file
interface Submission {
  grade?: number;
  feedback?: string;
  assignmentTitle: string;
  assignmentDetails?: AssignmentDetails;
  course: string;
  status: string;
  checkerData: CheckerDataEntry[];
}

interface AssignmentDetails {
  dueDate: string;
  lecturer: Lecturer;
}

interface Lecturer {
  avatar?: string;
  fullName: string;
}

interface CheckerDataEntry {
  amount: number;
  title: string;
  fill: string;
}

export default function GradingSheet({
  submission,
  onSubmit,
  onCancel,
}: {
  submission: any;
  onSubmit: (grade: number, feedback: string) => void;
  onCancel: () => void;
}) {
  const [isGrading, setIsGrading] = useState<boolean>(false); // State to toggle grading mode
  const [grade, setGrade] = useState<number>(submission.grade || 0);
  const [feedback, setFeedback] = useState<string>(submission.feedback || "");
  const [isEditing, setIsEditing] = useState<boolean>(!!submission.grade); // Check if already graded
  const { user } = useUser();

  const formatDueDate = (dueDate: string): string => {
    const date = new Date(dueDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleMarkClick = () => {
    setIsGrading(true); // Activate grading mode
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="text-sm dark:text-white mb-6">
        <a
          onClick={() => onCancel()}
          className="font-semibold text-black/50 dark:text-txt1 lg:text-xl cursor-pointer hover:underline"
        >
          Grades & Feedback
        </a>{" "}
        &gt; &gt;{" "}
        <span className="font-semibold lg:text-2xl">
          {submission.assignmentTitle}
        </span>
      </div>

      {/* Submission Details */}
      <div className="w-full bg-gray-200 space-y-6 px-4 py-6 m-6 mx-auto dark:bg-transparent">
        {/* First Card */}
        <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
          {/* Assignment Title */}
          <h1 className="text-xl font-bold mb-12">
            {submission.assignmentTitle}
          </h1>

          {/* Due Date and Course */}
          <div className="flex flex-col gap-8 justify-between lg:items-stretch mb-18 lg:gap-8 lg:mx-auto lg:flex-row">
            <div className="w-full flex flex-col justify-between gap-2">
              <p className="text-lg font-semibold">Due Date:</p>
              <p className="px-2 text-muted-foreground">
                {formatDueDate(submission.assignmentDetails?.dueDate)}
              </p>
              <hr className="border-t border-gray-300 mt-2" />
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <p className="text-lg font-semibold">Course:</p>
              <p className="px-2 text-muted-foreground">{submission.course}</p>
              <hr className="border-t border-gray-300 mt-2" />
            </div>
          </div>

          {/* Lecturer and Question */}
          <div className="flex flex-col gap-8 justify-between lg:items-stretch lg:gap-8 lg:mx-auto lg:flex-row">
            <div className="w-full flex flex-col justify-between gap-3">
              <p className="text-lg font-semibold">Lecturer:</p>
              <div className="flex px-2 items-center gap-2">
                <Image
                  src={
                    submission.assignmentDetails?.lecturer?.avatar ||
                    "/default-avatar.png"
                  }
                  alt={
                    submission.assignmentDetails?.lecturer.fullName ||
                    "Default Avatar"
                  }
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p className="text-sm text-muted-foreground">
                  {submission.assignmentDetails?.lecturer.fullName}
                </p>
              </div>
              <hr className="border-t border-gray-300 mt-2" />
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <p className="text-lg font-semibold">Grading Status:</p>
              <div className="flex px-2 items-center gap-1">
                <span
                  className={`w-4 h-4 border rounded-full ${
                    submission.status === "graded"
                      ? "border-bg5 bg-bg5"
                      : "border-red-500 bg-red-500"
                  }`}
                ></span>
                <p className="px-2 text-muted-foreground">
                  {submission.status}
                </p>
              </div>
              <hr className="border-t border-gray-300 mt-2" />
            </div>
          </div>
        </div>

        {/* Second Card */}

        <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Grade and Feedback:</h2>
          <div className="flex flex-col mt-8 gap-6 mx-auto lg:flex-row">
            {/* Left Section: Score and Feedback */}
            <div className="flex-1 space-y-9">
              <div className="w-full flex flex-col justify-between gap-2">
                <p className="text-lg font-semibold">Total Score:</p>
                <p className="text-3xl font-bold text-white">Pending</p>
              </div>

              <div className="w-full flex flex-col justify-between gap-2">
                <p className="font-semibold text-lg">Lecturer Feedback:</p>
                <p className="text-muted-foreground"></p>
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>

            {/* Right Section: Chart */}
            <div className="bg-bg1 border border-blue-500 rounded-md flex-1 flex items-center justify-center">
              <PieChart width={240} height={240}>
                <Pie
                  data={submission.checkerData}
                  dataKey="amount"
                  nameKey="title"
                  innerRadius={40} // Creates the "doughnut hole"
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {submission.checkerData.map(
                    (entry: CheckerDataEntry, index: number) => (
                      <Label
                        key={`cell-${index}`}
                        fill={entry.fill}
                        value={entry.title}
                        className="p-6"
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleMarkClick}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Mark
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
