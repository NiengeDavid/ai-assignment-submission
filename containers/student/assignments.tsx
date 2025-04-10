import { AssignmentCards } from "@/components/assignment-cards";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaFileAlt, FaDownload } from "react-icons/fa";

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
    name: string; // e.g., "Assignment Details.docx"
    size: string; // e.g., "24 KB"
    link: string; // e.g., "/assets/resources/assignment-details.docx"
  }[]; //
  gradeStatus?: string;
}
interface AssignmentsProps {
  setActiveTab: (tab: string) => void;
  selectedAssignment: Assignment | null;
  setSelectedAssignment: React.Dispatch<
    React.SetStateAction<Assignment | null>
  >;
}

export default function Assignments({
  setActiveTab,
  selectedAssignment,
  setSelectedAssignment,
}: AssignmentsProps) {
  // Helper function to calculate the "dueIn" value
  const calculateDueIn = (dueDate: string): string => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffInMs = due.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} left`;
    } else if (diffInDays === 0) {
      return "Due today";
    } else {
      return "Overdue";
    }
  };

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
        text: "View Details",
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
        text: "View Details",
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
        text: "View Details",
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
        text: "View Details",
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
    },
  ];

  return (
    <div className="bg-transparent w-full py-6 mx-auto space-y-6">
      {selectedAssignment ? (
        // Header
        <div>
          <div className="flex justify-between items-center mx-auto gap-6 bg-transparent px-4">
            <div className="text-sm dark:text-white">
              <a
                //href="#"
                onClick={() => setSelectedAssignment(null)}
                className="font-semibold text-black/50 dark:text-txt1 lg:text-xl cursor-pointer hover:underline"
              >
                Assignments
              </a>
              {" "}&gt; &gt;{" "}
              <span className="font-semibold lg:text-2xl">
                {selectedAssignment.course}
              </span>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-400 text-white font-medium px-4 py-2 cursor-pointer">
              Submit
            </Button>
          </div>
          <div className="bg-gray-200 w-full py-6 px-4 m-6 mx-auto space-y-6 dark:bg-transparent">
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
                    {formatDueDate(selectedAssignment.dueDate)} (
                    {calculateDueIn(selectedAssignment.dueDate)})
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
                  <p className="text-lg font-semibold">Question:</p>
                  <p className="px-2 text-muted-foreground">
                    {selectedAssignment.question}
                  </p>
                  <hr className="border-t border-gray-300 mt-2" />
                </div>
              </div>
            </div>

            {/* Second Card */}
            <div className="bg-white dark:bg-bg2 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Attached Resources</h2>
              {selectedAssignment.resources &&
              selectedAssignment.resources.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {selectedAssignment.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 dark:bg-transparent dark:border-2 dark:border-dashed p-4 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <FaFileAlt className="text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.size}
                          </p>
                        </div>
                      </div>
                      <a
                        href={resource.link}
                        download
                        className="text-blue-500 hover:text-blue-400 cursor-pointer"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No resources attached to this assignment.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="w-full px-3 flex gap-6 justify-between mx-auto items-center">
            <h1 className="font-semibold text-lg text-start md:text-2xl">
              Assignments
            </h1>
            <Button
              onClick={() => setActiveTab("Grades & Feedback")}
              className="bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer px-4 py-2 rounded-sm"
            >
              View Grades
            </Button>
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
