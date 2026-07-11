import React, { useState } from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import { Users, UserPlus } from 'lucide-react'
import { useParams } from "react-router-dom"
import InviteMemberBtn from '../../../common/InviteMemberBtn'

// Loading Skeleton Component
const TeamMembersSkeleton = ({ theme }) => {
  return (
    <div className={`${theme.card.primary} ${theme.border} p-4 transition-all duration-300 animate-pulse`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-700" />
          <div className="h-6 w-32 rounded bg-gray-700" />
          <div className="h-5 w-8 rounded-full bg-gray-700" />
        </div>
        <div className="h-8 w-20 rounded-lg bg-gray-700" />
      </div>

      {/* Members Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gray-700" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-24 rounded bg-gray-700 mb-1" />
              <div className="h-3 w-32 rounded bg-gray-700" />
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamMembers = ({ users, onInvite, loading, isOwner }) => {
  const { projectId } = useParams();
  const { theme } = useTheme();

  const getUserColor = (user) => {
    if (!user) return theme.avatar?.[0] || "from-blue-500 to-blue-700"

    const hash = user.name
      ? user.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0

    const colors = theme.avatar || [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ]

    return colors[hash % colors.length]
  }

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Show loading skeleton while fetching data
  if (loading) {
    return <TeamMembersSkeleton theme={theme} />;
  }

  return (
    <>
      <div className={`
        ${theme.card.primary}
        ${theme.border}
        p-4
        transition-all
        duration-300
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className={`h-5 w-5 ${theme.text.info}`} />
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Team Members
            </h2>
            <span className={`
              text-xs
              ${theme.text.muted}
              bg-white/5
              px-2 py-0.5
              rounded-full
            `}>
              {users?.length || 0}
            </span>
          </div>

          {isOwner && (
            <InviteMemberBtn users={users} projectId={projectId} />
          )}
        </div>

        {/* Members Grid */}
        {users?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users.map((user, index) => {
              const randomColor = getUserColor(user)
              const initials = getUserInitials(user?.name)

              return (
                <div
                  key={user?.uid || index}
                  className={`
                    flex items-center gap-3
                    p-2.5
                    rounded-lg
                    ${theme.card.hover}
                    transition-all
                    duration-200
                    group
                    cursor-default
                  `}
                >
                  {/* Avatar */}
                  <div className={`
                    shrink-0
                    w-9 h-9
                    rounded-full
                    bg-linear-to-br
                    ${randomColor}
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  `}>
                    {initials}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`
                      ${theme.text.primary}
                      text-sm
                      font-medium
                      truncate
                      transition-colors
                      duration-200
                      group-hover:text-blue-400
                    `}>
                      {user?.name || "Unknown User"}
                    </p>
                    {user?.email && (
                      <p className={`
                        ${theme.text.muted}
                        text-xs
                        truncate
                      `}>
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0">
                    <span className={`
                      inline-block
                      w-2 h-2
                      rounded-full
                      ${user?.status === 'active' ? 'bg-green-400' : 'bg-gray-500'}
                      shadow-sm
                      shadow-green-400/20
                    `} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className={`
            flex flex-col items-center justify-center
            py-8
            ${theme.text.muted}
            text-center
          `}>
            <Users className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">
              No team members yet
            </p>
            <p className="text-xs mt-1">
              Invite team members to collaborate
            </p>
            {isOwner && (
              <InviteMemberBtn users={users} projectId={projectId} />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default TeamMembers