import { SectionCards } from "@/components/section-cards";
import { AssignmentCards } from "@/components/assignment-cards";

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
}

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
      ] as [{ name: string; size: string; link: string }],
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
      ] as [{ name: string; size: string; link: string }],
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
