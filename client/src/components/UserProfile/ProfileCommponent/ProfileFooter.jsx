import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import ProfileAbout from "./ProfileFooter/ProfileAbout";
import ProfileTaskStatistics from "./ProfileFooter/ProfileTaskStatistics";
import ProfileProjects from "./ProfileFooter/ProfileProjects";

const ProfileFooter = ({ 
  user, 
  isCurrentUser, 
  userCreatedProjects, 
  userAssignedProjects 
}) => {
  const { theme } = useTheme();

  // Determine if there's any content to show
  const hasAboutContent = user?.about || user?.skills || user?.user_role || user?.location;
  const hasProjects = userAssignedProjects?.length > 0 || userCreatedProjects?.length > 0;
  const hasTasks = user?.uid; // Will be handled by ProfileTaskStatistics internally

  return (
    <div className="mt-6">
      {/* Responsive Grid Layout */}
      <div className={`
        grid 
        grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        gap-6
        transition-all
        duration-300
      `}>
        {/* About Card - Full width on mobile, spans appropriately */}
        <div className={`
          ${!isCurrentUser && !hasAboutContent ? 'hidden' : 'block'}
          col-span-1
          md:col-span-1
          lg:col-span-1
        `}>
          <ProfileAbout 
            user={user} 
            isCurrentUser={isCurrentUser} 
          />
        </div>

        {/* Projects Card - Full width on mobile */}
        <div className={`
          ${!hasProjects ? 'hidden' : 'block'}
          col-span-1
          md:col-span-1
          lg:col-span-1
        `}>
          <ProfileProjects 
            user={user}
            userAssignedProjects={userAssignedProjects}
            userCreatedProjects={userCreatedProjects}
          />
        </div>

        {/* Statistics Card - Full width on mobile */}
        <div className={`
          ${!hasTasks ? 'hidden' : 'block'}
          col-span-1
          md:col-span-2
          lg:col-span-1
        `}>
          <ProfileTaskStatistics 
            user={user} 
            isCurrentUser={isCurrentUser} 
          />
        </div>
      </div>

      {/* Divider when there's content */}
      {(hasAboutContent || hasProjects || hasTasks) && (
        <div className={`mt-8 pt-6 border-t ${theme.table.divider}`}>
          <div className={`
            flex 
            flex-col 
            sm:flex-row 
            items-center 
            justify-between 
            gap-3
            ${theme.text.muted}
            text-xs
          `}>
            <p>
              Profile last updated: {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
            </p>
            <p className="flex items-center gap-2">
              <span>•</span>
              <span>
                {userAssignedProjects?.length || 0} projects assigned
              </span>
              <span>•</span>
              <span>
                {userCreatedProjects?.length || 0} projects created
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Empty State - When no content at all */}
      {!hasAboutContent && !hasProjects && !hasTasks && isCurrentUser && (
        <div className={`
          ${theme.card.primary}
          ${theme.border}
          p-12
          text-center
          rounded-xl
          transition-all
          duration-300
        `}>
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-full
              bg-blue-500/10
              ${theme.text.info}
            `}>
              <svg 
                className="h-12 w-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                />
              </svg>
            </div>
            <div>
              <p className={`text-lg font-medium ${theme.text.primary}`}>
                No profile data available
              </p>
              <p className={`${theme.text.muted} text-sm mt-1 max-w-md`}>
                Start building your profile by adding information about yourself,
                your projects, and your tasks.
              </p>
            </div>
            <button
              className={`
                mt-2
                px-6
                py-2.5
                rounded-lg
                ${theme.button.primary}
                text-white
                font-medium
                transition-all
                duration-200
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-blue-500/25
                active:scale-[0.98]
              `}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFooter;