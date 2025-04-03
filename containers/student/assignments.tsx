import { AssignmentCards } from "@/components/assignment-cards";
import { Button } from "@/components/ui/button";

interface AssignmentsProps {
  setActiveTab: (tab: string) => void;
}

export default function Assignments({ setActiveTab }: AssignmentsProps) {
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
    },
  ];

  return (
    <div className="bg-transparent w-full py-6 mx-auto space-y-6">
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
          <AssignmentCards data={assignments} />
        </div>
      </div>
    </div>
  );
}
