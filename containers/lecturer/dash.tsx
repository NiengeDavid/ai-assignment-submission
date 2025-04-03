import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";

//type Props = {};

export default function Dash() {
  const cardData: {
    title: string;
    description: string;
    value: string;
    trend: "up" | "down";
    trendValue: string;
    footerText: string;
    footerDescription: string;
  }[] = [
    {
      title: "Total Revenue",
      description: "Total Revenue",
      value: "$1,250.00",
      trend: "up",
      trendValue: "+12.5%",
      footerText: "Trending up this month",
      footerDescription: "Visitors for the last 6 months",
    },
    {
      title: "New Customers",
      description: "New Customers",
      value: "1,234",
      trend: "down",
      trendValue: "-20%",
      footerText: "Down 20% this period",
      footerDescription: "Acquisition needs attention",
    },
    {
      title: "Active Accounts",
      description: "Active Accounts",
      value: "45,678",
      trend: "up",
      trendValue: "+12.5%",
      footerText: "Strong user retention",
      footerDescription: "Engagement exceed targets",
    },
    {
      title: "Growth Rate",
      description: "Growth Rate",
      value: "4.5%",
      trend: "up",
      trendValue: "+4.5%",
      footerText: "Steady performance increase",
      footerDescription: "Meets growth projections",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Add your dashboard content here */}
      <SectionCards data={cardData} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
