"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TripMap from "@/components/Map";
import { toast } from "sonner";
import EldChart from "@/components/ELDChart";
import EldStatus from "@/components/ELDstatus";
import { TripRouteResponse } from "@/types/responseData";
import TripSkeleton from "@/components/loading/tripViewLoading";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<TripRouteResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadTrip = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trip/${id}/`,
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to load trip");
          return;
        }

        setTrip(data);
      } catch (err) {
        console.error(err);
        toast.error("Server error while loading trip");
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  if (loading) {
    return <TripSkeleton />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl text-gray-600 my-3 font-bold">
        {trip.pickup_location} -&gt; {trip.dropoff_location}
      </h1>
      <div className="mb-6">
        <EldChart trip={trip} />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <TripMap
            current={trip.current}
            pickup={trip.pickup}
            dropoff={trip.dropoff}
            route1={trip.current_to_pickup}
            route2={trip.pickup_to_dropoff}
            fuelStops={trip.fuel_stops}
            restStops={trip.rest_stops}
          />
        </div>

        <div className="lg:col-span-3">
          <EldStatus trip={trip} />
        </div>
      </div>
    </div>
  );
}
