import Image from "next/image";
import { MapPin, Clock, Fuel } from "lucide-react";

interface TripCardProps {
  title: string;
  distance: string;
  duration: string;
  fuelStops: number;
  status: "Ongoing" | "Completed" | "Warning" | "Drafted";
}

const statusStyles = {
  Ongoing: "bg-indigo-50 text-indigo-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Warning: "bg-amber-50 text-amber-600",
  Drafted: "bg-slate-50 text-slate-600",
};

export default function TripCard({
  title,
  distance,
  duration,
  fuelStops,
  status,
}: TripCardProps) {
  return (
    <div className=" rounded-md    my-2 p-4 cursor-pointer hover:bg-white active:bg-slate-100">
      <div className="flex items-start justify-between">
        <h3 className="lg:text-lg text-sm font-semibold tracking-tight text-slate-600">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 lg:text-xs text-[10px] font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
      <p className=" text-[10px] text-slate-400 pl-1">
        20 February,26 - 25 February,26
      </p>
      <div className="mt-3 flex items-center gap-3 lg:text-xs text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin size={18} strokeWidth={2} className="text-green-500" />
          <span>{distance}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-yellow-500" />
          <span>{duration}</span>
        </div>

        <div className="flex items-center gap-2">
          <Fuel size={16} className="text-indigo-500" />
          <span>{fuelStops} Fuel Stops</span>
        </div>
      </div>
    </div>
  );
}
