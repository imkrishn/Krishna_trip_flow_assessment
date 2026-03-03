"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, X } from "lucide-react";
import { fetchSuggestions } from "@/utils/locationSuggestions";
import { toast } from "sonner";

interface TripFormData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleUsed: number;
}

export default function MakeTripPlan({ onClose }: { onClose?: () => void }) {
  const [formData, setFormData] = useState<TripFormData>({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: 0,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [clickOutside, setClickOutside] = useState<boolean>(true);
  const locationSuggestionsRef = useRef<HTMLUListElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClickOutside(false);

    setFormData({
      ...formData,
      [name]: name === "currentCycleUsed" ? Number(value) : value,
    });

    if (name !== "currentCycleUsed") {
      setActiveField(name);
      await fetchSuggestions(value, setSuggestions);
    }
  };

  const handleSelect = (value: string) => {
    if (!activeField) return;

    setFormData({
      ...formData,
      [activeField]: value,
    });

    setSuggestions([]);
  };

  //  handle click outside
  function handleClickOutside(e: MouseEvent) {
    if (
      locationSuggestionsRef.current &&
      !locationSuggestionsRef.current.contains(e.target as Node)
    ) {
      setClickOutside(true);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //handle submit

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      pickupLocation,
      dropoffLocation,
      currentCycleUsed,
      currentLocation,
    } = formData;

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !currentCycleUsed ||
      !currentLocation
    ) {
      return toast.warning("Please fill all the fields");
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trips/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      console.log("Generated Plan:", data);
    } catch {
      toast.error("Failed to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative m-2 z-10 w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="lg:text-2xl font-semibold text-slate-600">
            Create Trip
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-500 ">
          {[
            { label: "Current Location", name: "currentLocation" },
            { label: "Pickup Location", name: "pickupLocation" },
            { label: "Dropoff Location", name: "dropoffLocation" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="mb-1 block lg:text-sm text-xs font-medium text-slate-600">
                {field.label}
              </label>

              <div className="relative">
                <MapPin
                  strokeWidth={2}
                  className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"
                />

                <input
                  value={formData[field.name as keyof TripFormData] as string}
                  type="text"
                  name={field.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField(field.name)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full rounded-md border  border-slate-300 px-10 py-2 lg:text-sm text-xs outline-none "
                  required
                />
              </div>

              {/* suggestions */}
              {activeField === field.name &&
                suggestions.length > 0 &&
                !clickOutside && (
                  <ul
                    ref={locationSuggestionsRef}
                    className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg"
                  >
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item)}
                        className="cursor-pointer px-4 py-2 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}

          {/* cycle used */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Current Cycle Used (Hours)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                name="currentCycleUsed"
                value={formData.currentCycleUsed}
                onChange={handleChange}
                min={0}
                max={70}
                className="w-full rounded-xl border border-slate-300 px-10 py-2.5 text-sm outline-none "
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`mt-4 w-full cursor-pointer rounded-xl bg-blue-600 py-3 lg:text-sm text-xs font-semibold text-white transition-all duration-200 hover:bg-blue-700  active:scale-[0.98] ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? "Generating..." : "Generate Trip Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
