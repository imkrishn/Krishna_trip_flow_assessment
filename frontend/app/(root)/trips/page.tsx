"use client";

import TripCard from "@/components/TripCard";
import { useState } from "react";

type TabType = "Ongoing" | "Completed" | "Warning" | "Drafted";

const page = () => {
  const [currentTab, setCurrentTab] = useState<TabType>("Ongoing");
  const tabs: TabType[] = ["Ongoing", "Completed", "Warning", "Drafted"];
  return (
    <main className="lg:px-11 px-4 py-6 bg-[#f8f8f85e] h-screen overflow-auto">
      <div className="inline-flex rounded-xl mb-3 gap-2 ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={` p-2 lg:text-sm text-xs font-medium cursor-pointer transition-all duration-200 ${
              currentTab === tab
                ? "border-b-4 border-green-400  text-slate-900 "
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {["!", "!", "!"].map((_, index) => (
        <TripCard
          key={index}
          title={`Trip ${index + 1}`}
          distance={`${(index + 1) * 500} miles`}
          duration={`${(index + 1) * 5} hours driving`}
          fuelStops={index + 1}
          status={index % 2 === 0 ? "Ongoing" : "Completed"}
        />
      ))}
    </main>
  );
};

export default page;
