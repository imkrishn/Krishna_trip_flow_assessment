"use client";

import { TripRouteResponse } from "@/types/responseData";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  trip: TripRouteResponse;
}

export default function EldStatus({ trip }: Props) {
  const [status, setStatus] = useState<TripStatus>(trip.status);
  const [loading, setLoading] = useState(false);

  const totals = trip.eld_logs.reduce(
    (acc, day) => {
      acc.driving += day.summary.driving_hours;
      acc.onDuty += day.summary.on_duty_hours;
      acc.offDuty += day.summary.off_duty_hours;
      return acc;
    },
    { driving: 0, onDuty: 0, offDuty: 0 },
  );

  const fuelStops = trip.fuel_stops.length;
  const restStops = trip.rest_stops.length;

  const items = [
    { label: "Driving", value: `${totals.driving} hrs`, color: "bg-blue-500" },
    { label: "On Duty", value: `${totals.onDuty} hrs`, color: "bg-green-500" },
    { label: "Off Duty", value: `${totals.offDuty} hrs`, color: "bg-red-500" },
    { label: "Fuel Stops", value: fuelStops, color: "bg-yellow-500" },
    { label: "Rest Stops", value: restStops, color: "bg-purple-500" },
  ];

  // update plan status

  const updateStatus = async (newStatus: "ONGOING" | "FINISHED") => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trip/${trip.trip_id}/status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update trip");
        return;
      }

      setStatus(data.status);
      toast.success("Trip updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<TripStatus, string> = {
    ONGOING: "bg-blue-100 text-blue-700",
    FINISHED: "bg-green-100 text-green-700",
    DRAFTED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-5 w-full lg:h-full max-w-sm flex flex-col">
      <h2 className="text-gray-600 font-semibold text-lg mb-5">ELD Summary</h2>

      <div className="space-y-4 flex-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>

            <span className="text-sm font-medium text-gray-600">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-400 pt-4 flex justify-between items-center">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[status]}`}
        >
          {status}
        </span>

        {status === "ONGOING" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("FINISHED")}
            className="text-sm px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Finish Trip"}
          </button>
        )}

        {status === "DRAFTED" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("ONGOING")}
            className="text-sm px-4 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Resume Trip"}
          </button>
        )}
      </div>
    </div>
  );
}
