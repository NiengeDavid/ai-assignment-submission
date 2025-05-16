"use client";

import { useState } from "react";
import Image from "next/image";
import { PieChart } from "recharts";
import { useUser } from "@clerk/nextjs";

export default function GradingSheet({
  submission,
  onSubmit,
  onCancel,
}: {
  submission: any;
  onSubmit: (grade: number, feedback: string) => void;
  onCancel: () => void;
}) {
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
                <p className="text-muted-foreground">
                  
                </p>
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>

            {/* Right Section: Chart */}
            <div className="bg-bg1 border border-blue-500 rounded-md flex-1 flex items-center justify-center">
              {/* <PieChart width={240} height={240}>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70} // creates the "doughnut hole"
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", color: "#fff" }}
                />
              </PieChart> */}
            </div>

            
          </div>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-bg2 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">
          Submission Details for {submission.studentName}
        </h2>
        <p>
          <strong>Assignment:</strong> {submission.assignmentTitle}
        </p>
        <p>
          <strong>Course:</strong> {submission.course}
        </p>
        <p>
          <strong>Department:</strong> {submission.department}
        </p>
        <p>
          <strong>Level:</strong> {submission.level}
        </p>
        <p>
          <strong>Submitted At:</strong> {submission.submittedAt}
        </p>
        {submission.gradedAt && (
          <p>
            <strong>Graded At:</strong> {submission.gradedAt}
          </p>
        )}

        {/* Grading Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Grades" : "Mark Submission"}
          </h3>

          <div className="mt-4">
            <label className="block font-medium">Grade</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="border rounded p-2 w-full"
              min="0"
              max="100"
              disabled={isEditing && !submission.allowEdit}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="border rounded p-2 w-full"
              disabled={isEditing && !submission.allowEdit}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onSubmit(grade, feedback)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? "Update Grades" : "Submit Grades"}
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
