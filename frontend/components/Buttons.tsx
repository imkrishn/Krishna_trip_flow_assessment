"use client";

import { useRouter } from "next/navigation";

export const CreateTripPlanBtn = () => {
  return (
    <button className="cursor-pointer rounded-md bg-linear-to-r from-emerald-400 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.97]">
      + Make Trip Plan
    </button>
  );
};

export const ViewTripPlansBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/trips")}
      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 hover:shadow-md active:scale-[0.97]"
    >
      View Trips
    </button>
  );
};
