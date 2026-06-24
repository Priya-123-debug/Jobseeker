import React from "react";

function JobSkeleton() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-5 flex flex-col justify-between h-full animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3 sm:gap-4">
          {/* Logo placeholder */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0" />
          
          {/* Title & Company placeholder */}
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-32 sm:w-40" />
            <div className="h-3 bg-gray-200 rounded w-24 sm:w-32" />
          </div>
        </div>

        {/* Time placeholder */}
        <div className="h-3 bg-gray-200 rounded w-16 flex-shrink-0" />
      </div>

      {/* Description placeholder */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Tags placeholder */}
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>

      {/* Footer placeholder */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded-md w-20" />
      </div>
    </div>
  );
}

export default JobSkeleton;