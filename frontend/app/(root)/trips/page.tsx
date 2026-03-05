"use client";

import TripCard from "@/components/TripCard";
import TripsPageSkeleton from "@/components/loading/loadingTripCards";
import { TripRouteResponse } from "@/types/responseData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TabType = "All" | "Ongoing" | "Completed" | "Drafted";
type BackendStatus = "ONGOING" | "FINISHED" | "DRAFTED";

const tabToBackendStatus: Record<Exclude<TabType, "All">, BackendStatus> = {
  Ongoing: "ONGOING",
  Completed: "FINISHED",
  Drafted: "DRAFTED",
};

export default function Page() {
  const [currentTab, setCurrentTab] = useState<TabType>("All");
  const [trips, setTrips] = useState<TripRouteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs: TabType[] = ["All", "Ongoing", "Completed", "Drafted"];

  //fetch all trips of user

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trips/`,
          { cache: "no-store" },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch trips");
        }

        setTrips(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  //show all tab status
  const filteredTrips =
    currentTab === "All"
      ? trips
      : trips.filter((trip) => trip.status === tabToBackendStatus[currentTab]);

  const getTabCount = (tab: TabType) => {
    if (tab === "All") return trips.length;

    return trips.filter((trip) => trip.status === tabToBackendStatus[tab])
      .length;
  };

  return (
    <main className="lg:px-11 px-4 py-6 bg-[#f8f8f85e] min-h-screen overflow-auto">
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`pb-2 text-sm font-medium transition flex items-center gap-2 ${
              currentTab === tab
                ? "border-b-4 border-green-400 text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {loading && <TripsPageSkeleton />}

      {!loading && filteredTrips.length === 0 && (
        <div className="text-gray-400 text-sm">No trips found</div>
      )}

      {!loading && (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <TripCard
              id={trip.id}
              key={trip.id}
              date={trip.created_at}
              title={`${trip.pickup_location} → ${trip.dropoff_location}`}
              distance={`${trip.distance_miles?.toFixed(2)} miles`}
              duration={`${trip.duration_hours?.toFixed(2)} hours`}
              fuelStops={trip.fuel_stops?.length ?? 0}
              status={
                trip.status === "ONGOING"
                  ? "Ongoing"
                  : trip.status === "FINISHED"
                    ? "Completed"
                    : "Drafted"
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
