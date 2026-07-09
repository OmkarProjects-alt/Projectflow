import React from 'react';
import { useTheme } from '../../context/ThemeProvider';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
);

const UserProfilePageSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col p-3 space-y-6">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col gap-4">
        {/* Back Button Skeleton */}
        <Skeleton className="w-28 h-5" />

        {/* Profile Card Skeleton */}
        <div className={`
          ${theme.card.primary}
          p-6
          rounded-2xl
          border
          ${theme.border}
          shadow-xl
          shadow-black/10
        `}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar Skeleton */}
            <div className="relative shrink-0">
              <Skeleton className="w-28 h-28 md:w-32 md:h-32 rounded-full" />
              <div className={`
                absolute -bottom-1 -right-1
                p-1.5
                rounded-full
                border-4
                ${theme.card.primary}
                ${theme.border}
              `}>
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full">
              <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto">
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  <Skeleton className="h-8 w-48 md:h-9 md:w-56" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>

              {/* Stats Skeleton */}
              <div className={`
                w-full md:w-auto
                md:pl-6
                md:border-l
                ${theme.table.divider}
                pt-4 md:pt-0
                mt-4 md:mt-0
                border-t md:border-t-0
              `}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16 mt-0.5" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 w-full mt-3">
                  <Skeleton className="flex-1 h-14 rounded-lg" />
                  <Skeleton className="flex-1 h-14 rounded-lg" />
                </div>
                <Skeleton className="w-full h-10 rounded-lg mt-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card (Stats Cards) Skeleton */}
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`
              ${theme.card.primary}
              ${theme.border}
              p-5
              rounded-xl
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-12 mt-1.5" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/30">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Footer Skeleton */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* About Card Skeleton */}
          <div className={`
            ${theme.card.primary}
            ${theme.border}
            p-6
            rounded-xl
            max-h-[600px]
            overflow-y-auto
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-20 w-full rounded-lg" />
              <div className="border-t border-gray-700/30 pt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32 mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700/30 pt-4">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700/30 pt-4">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32 mt-1" />
                </div>
              </div>
              <div className="border-t border-gray-700/30 pt-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-7 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card Skeleton */}
          <div className={`
            ${theme.card.primary}
            ${theme.border}
            p-6
            max-h-125
            h-full
            overflow-y-auto
          `}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-16 w-20 rounded-lg" />
                <Skeleton className="h-16 w-20 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex flex-col flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48 mt-0.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-5 pt-4 border-t border-gray-700/30">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Task Statistics Card Skeleton */}
          <div className={`
            ${theme.card.primary}
            ${theme.border}
            p-6
            max-h-[500px]
            overflow-y-auto
          `}>
            <div className="sticky top-0 z-10 pb-4 mb-4 border-b border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <Skeleton className="h-55 w-full rounded-lg" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full mt-4 pt-4 border-t border-gray-700/30">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Divider Skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePageSkeleton;