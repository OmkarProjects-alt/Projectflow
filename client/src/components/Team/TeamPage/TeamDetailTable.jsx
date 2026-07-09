import React, { useState, useEffect, useMemo } from 'react'
import { useTaskStore } from '../../../store/tasksStore'
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeProvider';
import { useUserStore } from '../../../store/userStore';
import { Search, Filter, ChevronLeft, ChevronRight, Users, Briefcase, CheckCircle, X, Loader2 } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';

// Loading Skeleton Component
const TableSkeleton = ({ theme }) => {
  return (
    <div className={`${theme.card.primary} ${theme.border} overflow-hidden animate-pulse`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-800/50">
            <tr className="border-b border-gray-800">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <th key={i} className="py-3 px-4">
                  <div className="h-3 w-16 rounded bg-gray-700" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-gray-800">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700" />
                    <div className="min-w-0">
                      <div className="h-4 w-24 rounded bg-gray-700 mb-1" />
                      <div className="h-3 w-32 rounded bg-gray-700" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-6 w-16 rounded-full bg-gray-700" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-6 w-10 rounded-full bg-gray-700" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-6 w-10 rounded-full bg-gray-700" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-6 w-16 rounded-full bg-gray-700" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-4 w-20 rounded bg-gray-700" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="h-8 w-24 rounded-lg bg-gray-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-800">
        <div className="h-4 w-40 rounded bg-gray-700" />
        <div className="flex items-center gap-1.5">
          <div className="h-8 w-16 rounded-lg bg-gray-700" />
          <div className="h-8 w-8 rounded-lg bg-gray-700" />
          <div className="h-8 w-8 rounded-lg bg-gray-700" />
          <div className="h-8 w-8 rounded-lg bg-gray-700" />
          <div className="h-8 w-16 rounded-lg bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

const TeamDetailTable = ({ assignedTasks }) => {
  const messages = useTaskStore((state) => state.messages);
  const allTasks = useTaskStore((state) => state.allTasks);
  const { theme } = useTheme();
  
  const { pagination, fetchUsers, loading } = useUserStore();
  const users = useUserStore((state) => state.users);

  const { FecthAssignedProjects, assignedProjectLoaded } = useProjectStore();
  const assignedProject = useProjectStore((state) => state.assignedProject);
  const MyProjects = useProjectStore((state) => state.MyProjects);

  const onlineUsers = useUserStore(state => state.onlineUsers);

  const [activeFilter, setActiveFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(
        currentPage,
        10,
        searchKey,
        activeFilter,
        projectFilter
      );
    }, 400);

    return () => clearTimeout(timeout);
  }, [currentPage, searchKey, activeFilter, fetchUsers, projectFilter]);

  useEffect(() => {
    if (assignedProjectLoaded) return;
    FecthAssignedProjects();
  }, [FecthAssignedProjects, assignedProjectLoaded, assignedProject]);

  const getCommonProject = useMemo(() => {
    const combinedProject = [];
    MyProjects.forEach((project) => {
      combinedProject.push(project)
    });
    assignedProject.forEach((project) => {
      combinedProject.push(project);
    })
    return combinedProject;
  }, [MyProjects, assignedProject])

  const totalPages = pagination.totalPages;
  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  const useUserState = useMemo(() => {
    const state = {};
    users.forEach((user) => {
      const userTasks = allTasks.filter(
        (task) => task.assigned_to === user.uid
      );
      state[user.uid] = {
        tasks: userTasks.length,
        projects: new Set(userTasks.map(task => task.project_id)).size
      };
    });
    return state;
  }, [users, allTasks]);

  const getAvatarGradient = (name) => {
    const colors = theme.avatar || [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ];
    const hash = name ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const clearFilters = () => {
    setSearchKey("");
    setActiveFilter("all");
    setProjectFilter("all");
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`
              px-3 py-1.5
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
            `}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === 1
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
          `}
        >
          1
        </button>
      );

      if (currentPage > 4) {
        buttons.push(
          <span key="ellipsis1" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
            `}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="ellipsis2" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === totalPages
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
          `}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Active filters count
  const activeFiltersCount = [
    searchKey && 'search',
    activeFilter !== 'all' && 'filter',
    projectFilter !== 'all' && 'project'
  ].filter(Boolean).length;

  return (
    <div className={`${theme.card.primary} ${theme.border} rounded-lg overflow-hidden mt-7 transition-all duration-300`}>
      {/* Header */}
      <div className={`
        flex flex-col lg:flex-row lg:items-center lg:justify-between
        gap-4 p-4
        ${theme.table.divider}
        border-b
      `}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`
            p-2 rounded-lg
            bg-blue-500/10
            ${theme.text.info}
          `}>
            <Users className="h-5 w-5" />
          </div>
          <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
            Team Members
          </h3>
          <span className={`
            text-xs
            ${theme.text.muted}
            bg-white/5
            px-2 py-0.5
            rounded-full
            shrink-0
          `}>
            {users.length}
          </span>
          {activeFiltersCount > 0 && (
            <span className={`
              text-xs
              bg-blue-500/20
              text-blue-400
              px-2 py-0.5
              rounded-full
              shrink-0
            `}>
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearchFocused ? theme.text.info : theme.text.muted} h-4 w-4 transition-colors duration-200`} />
            <input 
              type="text" 
              className={`
                w-full pl-9 pr-10 py-2.5
                ${theme.input.input}
                rounded-xl
                text-sm
                transition-all
                duration-200
                ${isSearchFocused ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}
              `}
              placeholder="Search members..."
              value={searchKey}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => {
                setSearchKey(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchKey && (
              <button
                onClick={() => {
                  setSearchKey("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <select 
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setCurrentPage(1);
                }} 
                value={activeFilter}
                className={`
                  pl-9 pr-8 py-2.5
                  ${theme.input.select}
                  rounded-xl
                  text-sm
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                  bg-no-repeat
                  bg-[length:18px]
                  bg-[right_12px_center]
                  min-w-[130px]
                  transition-all
                  duration-200
                  ${activeFilter !== 'all' ? 'border-blue-500/50' : ''}
                `}
              >
                <option value="all">All Members</option>
                <option value="newer">Newest First</option>
                <option value="older">Oldest First</option>
                <option value="role">By Role</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <select 
                onChange={(e) => {
                  setProjectFilter(e.target.value);
                  setCurrentPage(1);
                }} 
                value={projectFilter}
                className={`
                  pl-9 pr-8 py-2.5
                  ${theme.input.select}
                  rounded-xl
                  text-sm
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                  bg-no-repeat
                  bg-[length:18px]
                  bg-[right_12px_center]
                  min-w-[130px]
                  transition-all
                  duration-200
                  ${projectFilter !== 'all' ? 'border-blue-500/50' : ''}
                `}
              >
                <option value="all">All Projects</option>
                {getCommonProject.map((project) => (
                  <option key={project.pid} value={project.pid}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className={`
                px-4 py-2.5
                rounded-xl
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                hover:${theme.text.primary}
                transition-all
                duration-200
                whitespace-nowrap
              `}
            >
              <X className="h-4 w-4 inline mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton theme={theme} />
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className={`${theme.table.header}`}>
              <tr className={`${theme.table.divider} border-b`}>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Member
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Role
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Projects
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Tasks
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Joined
                </th>
                <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className={theme.text.muted}>
                      <Users className="h-14 w-14 mx-auto mb-4 opacity-20" />
                      <p className="text-base font-medium">No users found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className={`mt-4 text-sm ${theme.text.info} hover:underline`}
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const role = user?.role === "user" ? "Member" : "Admin";
                  const totalProjects = useUserState[user?.uid]?.projects || 0;
                  const totalTasks = useUserState[user?.uid]?.tasks || 0;
                  const avatarGradient = getAvatarGradient(user?.name);
                  const isOnline = onlineUsers[user.uid];

                  return (
                    <tr
                      key={user.uid}
                      className={`
                        ${theme.table.row}
                        ${theme.table.divider}
                        border-b
                        transition-all
                        duration-200
                        hover:bg-gray-800/30
                        group
                      `}
                    >
                      {/* Member */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`
                            h-10 w-10
                            rounded-full
                            bg-gradient-to-br
                            ${avatarGradient}
                            flex items-center justify-center
                            text-white
                            font-semibold
                            text-sm
                            flex-shrink-0
                            shadow-md
                            transition-transform
                            duration-200
                            group-hover:scale-105
                          `}>
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className={`${theme.text.primary} font-medium text-sm truncate group-hover:text-blue-400 transition-colors duration-200`}>
                              {user?.name || "Unknown User"}
                            </p>
                            <p className={`${theme.text.muted} text-xs truncate`}>
                              {user?.email || "No email"}
                            </p>
                            {user?.user_role && (
                              <span className={`
                                px-1.5 py-0.5
                                rounded-full
                                text-[9px]
                                font-medium
                                bg-purple-500/10
                                text-purple-400
                                border
                                border-purple-500/20
                                hidden sm:inline-block
                                whitespace-nowrap
                              `}>
                                {user?.user_role}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <span className={`
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${role === "Admin" 
                            ? theme.status.progress
                            : theme.status.todo
                          }
                        `}>
                          {role}
                        </span>
                      </td>

                      {/* Projects */}
                      <td className="px-4 py-3.5">
                        <span className={`
                          inline-flex items-center gap-1.5
                          px-3 py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${theme.status.completed}
                        `}>
                          <Briefcase className="h-3 w-3" />
                          {totalProjects}
                        </span>
                      </td>

                      {/* Tasks */}
                      <td className="px-4 py-3.5">
                        <span className={`
                          inline-flex items-center gap-1.5
                          px-3 py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${theme.status.review}
                        `}>
                          <CheckCircle className="h-3 w-3" />
                          {totalTasks}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`
                          inline-flex items-center gap-2
                          px-2.5 py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${isOnline 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }
                        `}>
                          <span className={`
                            h-2 w-2 
                            rounded-full 
                            ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}
                          `} />
                          {isOnline ? 'Active' : 'Offline'}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className={`px-4 py-3.5 ${theme.text.muted} text-sm`}>
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "--"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/projectflow/user/${user?.uid}`}
                          className={`
                            px-4 py-2
                            rounded-lg
                            ${theme.button.primary}
                            text-white
                            text-sm
                            font-medium
                            transition-all
                            duration-200
                            hover:scale-105
                            hover:shadow-lg
                            hover:shadow-blue-500/20
                            active:scale-95
                            inline-flex
                            items-center
                            gap-1.5
                            whitespace-nowrap
                          `}
                        >
                          View Profile
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {users.length > 0 && !loading && (
        <div className={`
          flex flex-col sm:flex-row items-center justify-between
          gap-3 p-4
          ${theme.table.divider}
          border-t
        `}>
          <span className={`${theme.text.muted} text-sm`}>
            Showing <span className={theme.text.primary}>{from}</span> - <span className={theme.text.primary}>{to}</span> of <span className={theme.text.primary}>{pagination.total}</span> members
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
                hover:bg-gray-700/30
              `}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {renderPaginationButtons()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
                hover:bg-gray-700/30
              `}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamDetailTable;