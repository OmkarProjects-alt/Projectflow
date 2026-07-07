import React, { useState } from 'react';
import { useTheme } from '../../../../context/ThemeProvider';
import EditAndCreateProfileModal from '../../../common/EditAndCreateProfileModal';
import { PencilIcon, User2, PlusCircle, MapPin, Briefcase, Mail, Calendar, UserCog, Sparkles } from 'lucide-react';

const ProfileAbout = ({ user, isCurrentUser }) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const renderSkills = () => {
    if (!user?.skills) {
      return (
        <div className={`flex items-center gap-2 ${theme.text.muted} text-sm`}>
          <span>No skills added yet</span>
          {isCurrentUser && (
            <button
              onClick={handleModalToggle}
              className={`${theme.text.info} hover:${theme.text.primary} text-xs flex items-center gap-1 transition-colors duration-200`}
            >
              <PlusCircle className="w-3 h-3" />
              Add skills
            </button>
          )}
        </div>
      );
    }

    const skillsArray = Array.isArray(user.skills)
      ? user.skills
      : user.skills.split(',').map((skill) => skill.trim());

    if (skillsArray.length === 0) {
      return (
        <div className={`flex items-center gap-2 ${theme.text.muted} text-sm`}>
          <span>No skills added yet</span>
          {isCurrentUser && (
            <button
              onClick={handleModalToggle}
              className={`${theme.text.info} hover:${theme.text.primary} text-xs flex items-center gap-1 transition-colors duration-200`}
            >
              <PlusCircle className="w-3 h-3" />
              Add skills
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {skillsArray.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className={`
              ${theme.status.progress}
              px-3 py-1
              rounded-full
              text-xs
              font-medium
              border
              border-blue-500/20
            `}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const renderFieldWithAdd = (label, value, icon, fieldName, emptyMessage) => {
    const hasValue = value && value !== '-';
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className={`${theme.text.muted} text-xs uppercase tracking-wider font-medium flex items-center gap-2`}>
            {icon}
            {label}
          </p>
          {isCurrentUser && !hasValue && (
            <button
              onClick={handleModalToggle}
              className={`${theme.text.info} hover:${theme.text.primary} text-xs flex items-center gap-1 transition-colors duration-200`}
            >
              <PlusCircle className="w-3 h-3" />
              Add {fieldName}
            </button>
          )}
        </div>
        {hasValue ? (
          <p className={`${theme.text.primary} text-sm`}>{value}</p>
        ) : (
          <p className={`${theme.text.muted} text-sm italic`}>{emptyMessage}</p>
        )}
      </div>
    );
  };

  const hasAnyData = user?.about || user?.skills || user?.user_role || user?.location;

  return (
    <>
      {isModalOpen && (
        <EditAndCreateProfileModal
          open={isModalOpen}
          onClose={handleModalToggle}
          user={user}
        />
      )}

      <div
        className={`
          ${!isCurrentUser && !hasAnyData ? 'hidden' : 'block'}
          ${theme.card.primary}
          p-6
          rounded-xl
          transition-all
          duration-300
          ${theme.card.hover}
          max-h-[600px]
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-gray-700
          scrollbar-track-transparent
        `}
      >
        {!hasAnyData && isCurrentUser ? (
          // Complete empty state - nothing filled yet
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`
              p-4 rounded-full
              bg-blue-500/10
              ${theme.text.info}
              mb-4
            `}>
              <User2 className="w-10 h-10" />
            </div>
            <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
              Tell others about yourself
            </h3>
            <p className={`${theme.text.muted} text-sm mt-2 max-w-xs`}>
              Add your bio, department, skills, and other professional details.
            </p>
            <button
              onClick={handleModalToggle}
              className={`
                mt-6
                px-6
                py-2.5
                ${theme.button.primary}
                text-white
                font-medium
                transition-all
                duration-200
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-blue-500/25
                active:scale-[0.98]
                rounded-lg
              `}
            >
              <PlusCircle className="w-4 h-4 inline mr-2" />
              Add About
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className={`h-5 w-5 ${theme.text.info}`} />
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  About
                </h2>
              </div>
              {isCurrentUser && (
                <button
                  onClick={handleModalToggle}
                  className={`
                    text-sm
                    ${theme.text.info}
                    hover:${theme.text.primary}
                    font-medium
                    transition-all
                    duration-200
                    flex
                    items-center
                    gap-1.5
                    cursor-pointer
                    hover:scale-[1.02]
                    active:scale-[0.98]
                  `}
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* About/Bio Section */}
              <div>
                {user?.about ? (
                  <div className={`
                    ${theme.card.secondary}
                    p-4
                    rounded-lg
                    border
                    border-gray-700/30
                  `}>
                    <p className={`${theme.text.secondary} text-sm leading-relaxed`}>
                      {user.about}
                    </p>
                  </div>
                ) : (
                  isCurrentUser && (
                    <div className={`
                      ${theme.card.secondary}
                      p-4
                      rounded-lg
                      border
                      border-dashed
                      border-gray-700/30
                    `}>
                      <div className="flex items-center justify-between">
                        <p className={`${theme.text.muted} text-sm`}>No bio added yet</p>
                        <button
                          onClick={handleModalToggle}
                          className={`${theme.text.info} hover:${theme.text.primary} text-sm flex items-center gap-1 transition-colors duration-200`}
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add bio
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Location Section */}
              {(user?.location || isCurrentUser) && (
                <div className={`border-t ${theme.table.divider} pt-4`}>
                  {renderFieldWithAdd(
                    'Location',
                    user?.location,
                    <MapPin className="w-3 h-3" />,
                    'location',
                    'No location added'
                  )}
                </div>
              )}

              {/* Department & Role Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-t ${theme.table.divider} pt-4`}>
                <div>
                  {renderFieldWithAdd(
                    'Department',
                    user?.user_role,
                    <Briefcase className="w-3 h-3" />,
                    'department',
                    'No department specified'
                  )}
                </div>
                <div>
                  {renderFieldWithAdd(
                    'Role',
                    user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null,
                    <UserCog className="w-3 h-3" />,
                    'role',
                    'No role specified'
                  )}
                </div>
              </div>

              {/* Email & Joined */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-t ${theme.table.divider} pt-4`}>
                <div className="space-y-1">
                  <p className={`${theme.text.muted} text-xs uppercase tracking-wider font-medium flex items-center gap-2`}>
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  <p className={`${theme.text.primary} text-sm break-all`}>
                    {user?.email || '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`${theme.text.muted} text-xs uppercase tracking-wider font-medium flex items-center gap-2`}>
                    <Calendar className="w-3 h-3" />
                    Joined
                  </p>
                  <p className={`${theme.text.primary} text-sm`}>
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              <div className={`border-t ${theme.table.divider} pt-4`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${theme.text.muted} text-xs uppercase tracking-wider font-medium`}>
                    Skills & Expertise
                  </p>
                  {isCurrentUser && !user?.skills && (
                    <button
                      onClick={handleModalToggle}
                      className={`${theme.text.info} hover:${theme.text.primary} text-xs flex items-center gap-1 transition-colors duration-200`}
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add skills
                    </button>
                  )}
                </div>
                {renderSkills()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileAbout;