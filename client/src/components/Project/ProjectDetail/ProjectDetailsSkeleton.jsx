import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';

// Skeleton sub-components
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
);

const ProjectDetailsSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header Skeleton - Replicates CommonHeader */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          {/* Left Side */}
          <div className="flex gap-4 w-full sm:w-auto">
            {/* Avatar Skeleton */}
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-3">
              {/* Back Button Skeleton */}
              <Skeleton className="w-16 h-4" />
              
              {/* Title Skeleton */}
              <Skeleton className="w-48 sm:w-64 h-8" />
              
              {/* Description Skeleton */}
              <Skeleton className="w-full max-w-3xl h-5" />
              <Skeleton className="w-3/4 max-w-2xl h-5" />
              
              {/* Status + Deadline + Progress Skeleton */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Skeleton className="w-20 h-7 rounded-full" />
                <Skeleton className="w-28 h-5" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-24 sm:w-32 h-2 rounded-full" />
                  <Skeleton className="w-10 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Actions Skeleton */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Skeleton className="w-full sm:w-32 h-10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* StateSection Skeleton */}
      <div className="space-y-4">
        {/* Progress Overview Bar Skeleton */}
        <div className={`
          ${theme.card.primary}
          ${theme.border}
          p-4
          flex
          flex-col
          sm:flex-row
          items-start
          sm:items-center
          justify-between
          gap-3
        `}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Skeleton className="w-28 h-5" />
            <Skeleton className="flex-1 sm:w-48 h-2 rounded-full" />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>

        {/* Stats Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`
              ${theme.card.primary}
              ${theme.border}
              p-4
              rounded-xl
              animate-pulse
            `}>
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-12 h-8" />
            </div>
          ))}
        </div>

        {/* Quick Stats Footer Skeleton */}
        <div className={`
          ${theme.card.secondary}
          ${theme.border}
          p-3
          flex
          flex-wrap
          items-center
          justify-between
          gap-2
        `}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-24 h-4" />
          ))}
        </div>
      </div>

      {/* ProjectTasksDetails Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Table Skeleton */}
            <div className="min-w-0 overflow-hidden">
              <div className={`${theme.card.primary} ${theme.border} overflow-hidden animate-pulse`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.table.divider}`}>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-70 h-70 overflow-y-auto">
                  <table className="w-full">
                    <thead className={`${theme.table.header} sticky top-0 z-10`}>
                      <tr className={`${theme.table.divider} border-b`}>
                        {['Title', 'Assigned', 'Status', 'Priority', 'Due Date', ''].map((_, i) => (
                          <th key={i} className="px-3 py-3">
                            <Skeleton className="h-3 w-16" />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((row) => (
                        <tr key={row} className={`${theme.table.divider} border-b`}>
                          <td className="px-3 py-3.5">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-7 w-7 rounded-full" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-2 w-2 rounded-full" />
                              <Skeleton className="h-4 w-14" />
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-2 py-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More Skeleton */}
                <div className={`flex justify-center py-4 border-t ${theme.table.divider}`}>
                  <Skeleton className="h-9 w-40 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="flex flex-col gap-4 min-w-0 mt-4 lg:mt-0">
              {/* ProjectOverview Skeleton */}
              <div className={`${theme.card.primary} ${theme.border} rounded-2xl p-3 px-3 animate-pulse`}>
                <Skeleton className="h-7 w-48 mb-4" />
                <div className="flex flex-col items-center justify-center py-8">
                  <Skeleton className="h-50 w-50 rounded-full mb-4" />
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-700/50">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-6" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TeamMembers Skeleton */}
              <div className={`${theme.card.primary} ${theme.border} p-4 animate-pulse`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="w-2 h-2 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSkeleton;