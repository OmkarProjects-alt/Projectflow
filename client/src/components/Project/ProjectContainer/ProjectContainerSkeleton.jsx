import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
);

const ProjectContainerSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="h-full">
      <div className="flex flex-col gap-5">
        {/* Filters - Desktop Skeleton */}
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-11 w-40 rounded-lg" />
            <Skeleton className="h-11 w-44 rounded-lg" />
          </div>
        </div>

        {/* Filters - Mobile Skeleton */}
        <div className="md:hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className={`
              ${theme.card.primary}
              p-5
              flex
              flex-col
              h-full
              animate-pulse
            `}>
              {/* Header */}
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              {/* Status & Days Remaining */}
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Progress Section */}
              <div className="mt-4 flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectContainerSkeleton;