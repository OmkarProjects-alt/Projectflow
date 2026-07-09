import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
);

const TaskPageSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
        <div className="flex items-center gap-3">
          <Skeleton className="p-2.5 rounded-xl h-12 w-12 hidden sm:flex" />
          <div>
            <Skeleton className="h-8 w-40 sm:w-56" />
            <Skeleton className="h-4 w-48 sm:w-64 mt-1.5" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 pr-5 rounded-xl w-full md:w-auto bg-gray-800/50">
          <Skeleton className="p-2.5 rounded-lg h-12 w-12" />
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-40 mt-1" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="space-y-4">
        <div className="bg-gray-800/50 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="flex-1 sm:w-48 h-2 rounded-full" />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800/50 p-4 rounded-xl">
              <div className="flex items-start gap-4">
                <Skeleton className="p-2.5 rounded-xl h-14 w-14 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12 mt-1" />
                  <Skeleton className="h-3 w-16 mt-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-700/30">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden p-4">
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-700">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="px-4 py-2.5 h-10 w-20" />
          ))}
        </div>
        <div className="space-y-4 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-9 w-20 rounded-lg" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-lg" />
            ))}
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPageSkeleton;