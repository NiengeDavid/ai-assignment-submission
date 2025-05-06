"use client";

import { useState } from "react";
import { AssignmentCards } from "@/components/assignment-cards";
import Image from "next/image";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Content & Research", value: 70 },
  { name: "Originality & Plagiarism Score", value: 20 },
  { name: "Grammar & Formatting", value: 10 },
];

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD"]; // Blue shades

interface Assignment {
  id: string;
  image: string;
  lecturer: {
    avatar: string;
    name: string;
  };
  dueDate: string;
  course: string;
  title: string;
  question: string;
  btnAction: {
    text: string;
    link: string;
  };
  resources: {
    name: string;
    size: string;
    link: string;
  }[];
  gradeStatus?: string;
}

export default function Grades() {
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  // Helper function to format the due date
  const formatDueDate = (dueDate: string): string => {
    const date = new Date(dueDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const assignments = [
    {
      id: "1",
      image: "/assets/assignment1.png",
      lecturer: {
        avatar: "/assets/avatars/lecturer1.png",
        name: "Dr. John Doe",
      },
      dueDate: "2025-04-10",
      course: "SEN401 - Software Engineering Economics",
      title: "Software Engineering Principles - Research Paper",
      question:
        "Write a 5-page research paper on the principles of Software Engineering, focusing on scalability, maintainability, and security. Provide real-world examples and cite at least three academic sources.",
      btnAction: {
        text: "View Grades & Feedback",
        link: "/assignments/1",
      },
      resources: [
        {
          name: "Assignment Details.docx",
          size: "24 KB",
          link: "/assets/resources/assignment-details.docx",
        },
        {
          name: "Grading Rubric.pdf",
          size: "18 KB",
          link: "/assets/resources/grading-rubric.pdf",
        },
      ],
      gradeStatus: "Successful",
    },
    {
      id: "2",
      image: "/assets/assignment1.png",
      lecturer: {
        avatar: "/assets/avatars/lecturer1.png",
        name: "Prof. Jane Smith",
      },
      dueDate: "2025-04-09",
      course: "SEN402 - Advanced Software Design",
      title: "Design Patterns - Case Study",
      question:
        "Analyze the use of design patterns in a real-world software project. Focus on patterns like Singleton, Factory, and Observer. Provide examples and discuss their impact on the project's scalability and maintainability.",
      btnAction: {
        text: "View Grades & Feedback",
        link: "/assignments/2",
      },
      resources: [
        {
          name: "Assignment Details.docx",
          size: "24 KB",
          link: "/assets/resources/assignment-details.docx",
        },
        {
          name: "Grading Rubric.pdf",
          size: "18 KB",
          link: "/assets/resources/grading-rubric.pdf",
        },
      ],
      gradeStatus: "Unsuccessful",
    },
    {
      id: "3",
      image: "/assets/assignment1.png",
      lecturer: {
        avatar: "/assets/avatars/lecturer1.png",
        name: "Dr. Emily White",
      },
      dueDate: "2025-04-05",
      course: "SEN403 - Software Testing",
      title: "Automated Testing Frameworks",
      question:
        "Research and compare two popular automated testing frameworks. Discuss their features, advantages, and limitations. Provide examples of how they can be integrated into a CI/CD pipeline.",
      btnAction: {
        text: "View Grades & Feedback",
        link: "/assignments/3",
      },
      resources: [
        {
          name: "Assignment Details.docx",
          size: "24 KB",
          link: "/assets/resources/assignment-details.docx",
        },
        {
          name: "Grading Rubric.pdf",
          size: "18 KB",
          link: "/assets/resources/grading-rubric.pdf",
        },
      ],
      gradeStatus: "Unsuccessful",
    },
    {
      id: "4",
      image: "/assets/assignment1.png",
      lecturer: {
        avatar: "/assets/avatars/lecturer1.png",
        name: "Dr. Emily White",
      },
      dueDate: "2025-04-05",
      course: "SEN403 - Software Testing",
      title: "Automated Testing Frameworks",
      question:
        "Research and compare two popular automated testing frameworks. Discuss their features, advantages, and limitations. Provide examples of how they can be integrated into a CI/CD pipeline.",
      btnAction: {
        text: "View Grades & Feedback",
        link: "/assignments/4",
      },
      resources: [
        {
          name: "Assignment Details.docx",
          size: "24 KB",
          link: "/assets/resources/assignment-details.docx",
        },
        {
          name: "Grading Rubric.pdf",
          size: "18 KB",
          link: "/assets/resources/grading-rubric.pdf",
        },
      ],
      gradeStatus: "Unsuccessful",
    },
  ];

  return (
    <div className="flex flex-col gap-8 mt-6">
      {selectedAssignment ? (
        // Grades & Feedback Details View
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-start gap-6 bg-transparent px-4">
            <div className="text-sm dark:text-white">
              <a
                //href="#"
                onClick={() => setSelectedAssignment(null)}
                className="font-semibold text-black/50 dark:text-txt1 lg:text-xl cursor-pointer hover:underline"
              >
                Grades & Feedback
              </a>{" "}
              &gt; &gt;{" "}
              <span className="font-semibold lg:text-2xl">
                {selectedAssignment.course}
              </span>
            </div>
          </div>

          {/* Grades & Feedback Details */}
          <div className="w-full bg-gray-200 space-y-6 px-4 py-6 m-6 mx-auto dark:bg-transparent">
            {/* First Card */}
            <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
              {/* Assignment Title */}
              <h1 className="text-xl font-bold mb-12">
                {selectedAssignment.title}
              </h1>

              {/* Due Date and Course */}
              <div className="flex flex-col gap-8 justify-between lg:items-stretch mb-18 lg:gap-8 lg:mx-auto lg:flex-row">
                <div className="w-full flex flex-col justify-between gap-2">
                  <p className="text-lg font-semibold">Due Date:</p>
                  <p className="px-2 text-muted-foreground">
                    {formatDueDate(selectedAssignment.dueDate)}
                  </p>
                  <hr className="border-t border-gray-300 mt-2" />
                </div>
                <div className="w-full flex flex-col justify-between gap-2">
                  <p className="text-lg font-semibold">Course:</p>
                  <p className="px-2 text-muted-foreground">
                    {selectedAssignment.course}
                  </p>
                  <hr className="border-t border-gray-300 mt-2" />
                </div>
              </div>

              {/* Lecturer and Question */}
              <div className="flex flex-col gap-8 justify-between lg:items-stretch lg:gap-8 lg:mx-auto lg:flex-row">
                <div className="w-full flex flex-col justify-between gap-3">
                  <p className="text-lg font-semibold">Lecturer:</p>
                  <div className="flex px-2 items-center gap-2">
                    <Image
                      src={selectedAssignment.lecturer.avatar}
                      alt={selectedAssignment.lecturer.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedAssignment.lecturer.name}
                    </p>
                  </div>
                  <hr className="border-t border-gray-300 mt-2" />
                </div>
                <div className="w-full flex flex-col justify-between gap-2">
                  <p className="text-lg font-semibold">Grading Status:</p>
                  <div className="flex px-2 items-center gap-1">
                    <span
                      className={`w-4 h-4 border rounded-full ${
                        selectedAssignment.gradeStatus === "Successful"
                          ? "border-bg5 bg-bg5"
                          : "border-red-500 bg-red-500"
                      }`}
                    ></span>
                    <p className="px-2 text-muted-foreground">
                      {selectedAssignment.gradeStatus}
                    </p>
                  </div>
                  <hr className="border-t border-gray-300 mt-2" />
                </div>
              </div>
            </div>

            {/* Second Card */}
            {selectedAssignment.gradeStatus === "Successful" && (
              <div className="bg-white dark:bg-bg2 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4">Grade and Feedback:</h2>
                <div className="flex flex-col mt-8 gap-6 mx-auto lg:flex-row">
                  {/* Left Section: Score and Feedback */}
                  <div className="flex-1 space-y-9">
                    <div className="w-full flex flex-col justify-between gap-2">
                      <p className="text-lg font-semibold">Total Score:</p>
                      <p className="text-3xl font-bold text-white">
                        85 / 100
                      </p>
                    </div>

                    <div className="w-full flex flex-col justify-between gap-2">
                      <p className="font-semibold text-lg">
                        Lecturer Feedback:
                      </p>
                      <p className="text-muted-foreground">
                        Great job! Your research was well-structured, but ensure
                        better citation formatting. Check the annotated file for
                        details.
                      </p>
                    </div>

                    <hr className="border-t border-gray-300 mt-2" />
                  </div>

                  {/* Right Section: Chart */}
                  <div className="bg-bg1 border border-blue-500 rounded-md flex-1 flex items-center justify-center">
                    <PieChart width={240} height={240}>
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
                    </PieChart>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Grades List View
        <div className="flex flex-col gap-8 mt-6">
          <div className="w-full px-3 flex gap-6 justify-between mx-auto items-center">
            <h1 className="font-semibold text-xl text-start md:text-3xl">
              Grades & Feedback
            </h1>
          </div>
          <div className="flex w-full justify-center items-center mx-auto p-3">
            <AssignmentCards
              data={assignments}
              onViewDetails={(assignment) => setSelectedAssignment(assignment)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
