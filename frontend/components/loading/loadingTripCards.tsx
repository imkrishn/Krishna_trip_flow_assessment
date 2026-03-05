export default function TripsPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 rounded-md" />
        ))}
      </div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="h-5 w-80 bg-gray-200 rounded" />

              <div className="h-4 w-40 bg-gray-200 rounded" />

              <div className="flex gap-6 mt-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="h-7 w-20 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
