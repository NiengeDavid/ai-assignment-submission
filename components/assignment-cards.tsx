import Image from "next/image";

interface Assignment {
  id: string;
  image: string;
  lecturer: {
    avatar: string;
    name: string;
  };
  dueDate: string; // e.g., "March 10, 2025"
  course: string; // e.g., "SEN401 - Software Engineering Economics"
  title: string; // e.g., "Software Engineering Principles - Research Paper"
  question: string; // e.g., "Write a 5-page research paper..."
  btnAction: {
    text: string; // e.g., "View Details"
    link: string; // e.g., "/assignments/1"
  };
  resources: {
    name: string; // e.g., "Assignment Details.docx"
    size: string; // e.g., "24 KB"
    link: string; // e.g., "/assets/resources/assignment-details.docx"
  }[]; //
}

interface AssignmentCardsProps {
  data: Assignment[];
  onViewDetails: (assignment: Assignment) => void; // Callback for viewing details
}

export function AssignmentCards({ data, onViewDetails }: AssignmentCardsProps) {
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

  return (
    <div className="grid grid-cols-1 gap-6 mx-auto lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.map((assignment) => (
        <div
          key={assignment.id}
          className="bg-white dark:bg-bg2 shadow-md rounded-lg overflow-hidden max-w-sm mx-auto"
        >
          {/* Assignment Image */}
          <div className="w-full">
            <Image
              src={assignment.image}
              alt={assignment.title}
              className="h-full w-full"
              width={344}
              height={194}
              objectFit="cover"
            />
          </div>

          {/* Assignment Details */}
          <div className="p-4 mt-4">
            {/* Lecturer Details and Due Date */}
            <div className="flex items-center gap-1 justify-between text-sm text-muted-foreground dark:text-white mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={assignment.lecturer.avatar}
                  alt={assignment.lecturer.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{assignment.lecturer.name}</span>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                {formatDueDate(assignment.dueDate)} (
                {calculateDueIn(assignment.dueDate)})
              </span>
            </div>

            {/* Course */}
            <p className="text-sm font-medium text-primary mb-1">
              {assignment.course}
            </p>

            {/* Assignment Title */}
            <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>

            {/* Assignment Question Brief */}
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {assignment.question}
            </p>

            {/* View Details Button */}
            <a
              onClick={() => onViewDetails(assignment)}
              className="bg-blue-500 px-4 py-2 w-full text-center rounded-sm cursor-pointer text-white hover:bg-blue-400 text-sm font-medium block"
            >
              {assignment.btnAction.text}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
