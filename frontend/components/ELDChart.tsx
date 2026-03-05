"use client";

import { useState } from "react";
import { TripRouteResponse } from "@/types/responseData";

interface Props {
  trip: TripRouteResponse;
}

const statusRows = ["OFF", "DR", "ON"];

const statusLabels: Record<string, string> = {
  OFF: "Off Duty",
  DR: "Driving",
  ON: "On Duty",
};

const statusColor: Record<string, string> = {
  OFF: "#ef4444",
  DR: "#2563eb",
  ON: "#10b981",
};

function timeToHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export default function EldGrid({ trip }: Props) {
  const [dayIndex, setDayIndex] = useState(0);

  const day = trip.eld_logs[dayIndex];

  return (
    <div className="bg-white shadow-md p-5 rounded-lg border border-gray-200 w-full">
      <div className="flex gap-2 mb-4 flex-wrap">
        {trip.eld_logs.map((d, i) => (
          <button
            key={i}
            onClick={() => setDayIndex(i)}
            className={`px-3 cursor-pointer py-1.5 rounded text-sm ${
              i === dayIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-225 border border-gray-300 rounded">
          <div className="grid  grid-cols-[120px_repeat(24,1fr)] text-[11px] text-gray-500 border-b border-gray-300 bg-gray-50">
            <div />
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="text-center border-l border-gray-200 py-1"
              >
                {i}
              </div>
            ))}
          </div>

          {statusRows.map((status) => (
            <div
              key={status}
              className="grid grid-cols-[120px_repeat(24,1fr)] h-12 border-b border-gray-200"
            >
              <div className="flex items-center px-3 text-xs font-medium text-gray-700 border-r border-gray-300 bg-gray-50">
                {statusLabels[status]}
              </div>

              <div className="col-span-24 relative">
                <div className="absolute inset-0 grid grid-cols-24">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-l border-gray-200" />
                  ))}
                </div>

                {/* logs */}
                {day.log
                  .filter((log) => log.status === status)
                  .map((log, i) => {
                    const start = timeToHour(log.start);
                    const end = timeToHour(log.end);

                    return (
                      <div
                        key={i}
                        className="absolute h-full opacity-90"
                        style={{
                          left: `${(start / 24) * 100}%`,
                          width: `${((end - start) / 24) * 100}%`,
                          background: statusColor[status],
                        }}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
