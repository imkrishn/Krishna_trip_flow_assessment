"use client";

export default function TripSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex gap-2 mb-4">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-24 h-6 bg-gray-200 rounded" />
            <div className="flex-1 h-6 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-6 bg-gray-200 rounded" />
            <div className="flex-1 h-6 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-6 bg-gray-200 rounded" />
            <div className="flex-1 h-6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <div className="bg-white border border-gray-200 rounded-lg h-105 w-full" />
        </div>
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-5">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>

            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>

            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>

            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
