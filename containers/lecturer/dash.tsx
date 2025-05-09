import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";

interface DashProps {
  setActiveTab: (tab: string) => void;
}

export default function LectDash({ setActiveTab }: DashProps) {
  const cardData: {
    title: string;
    description: string;
    value: string;
    trend: "up" | "down";
    trendValue: string;
    footerText: string;
    footerDescription?: string;
  }[] = [
    {
      title: "Total Assignments Created",
      description: "Total Assignments Created",
      value: "15",
      trend: "up",
      trendValue: "+12.5%",
      footerText: "Assignments Published",
    },
    {
      title: "Pending Submissions",
      description: "Pending Submissions",
      value: "10",
      trend: "down",
      trendValue: "-20%",
      footerText: "Assignments Awaiting Grading",
    },
    {
      title: "Graded Assignments",
      description: "Graded Assignments",
      value: "120",
      trend: "up",
      trendValue: "+12.5%",
      footerText: "Students Graded",
    },
    // {
    //   title: "Growth Rate",
    //   description: "Growth Rate",
    //   value: "4.5%",
    //   trend: "up",
    //   trendValue: "+4.5%",
    //   footerText: "Steady performance increase",
    //   footerDescription: "Meets growth projections",
    // },
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

      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      {/* Upcoming Assignments */}
      <div className="bg-transparent w-full py-6 m-6 mx-auto space-y-6">
        <div className="flex flex-col gap-8">
          <div className="w-full px-3 flex gap-6 justify-between mx-auto items-center">
            <h1 className="font-semibold text-lg text-start md:text-2xl">
              Recent Submissions List
            </h1>
            <button
              onClick={() => setActiveTab("Grades & Feedback")}
              className="bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer px-4 py-2 rounded-sm"
            >
              View All
            </button>
          </div>
          <div className="flex w-full justify-center items-center mx-auto">
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
}
