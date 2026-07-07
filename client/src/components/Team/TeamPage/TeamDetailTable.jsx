import React, { useState, useEffect, useMemo } from 'react'
import { useTaskStore } from '../../../store/tasksStore'
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeProvider';
import { useUserStore } from '../../../store/userStore';
import { Search, Filter, ChevronLeft, ChevronRight, Users, Briefcase, CheckCircle } from 'lucide-react';

const TeamDetailTable = ({ assignedTasks }) => {
  const messages = useTaskStore((state) => state.messages);
  const allTasks = useTaskStore((state) => state.allTasks);
  const { theme } = useTheme();
  
  const { pagination, fetchUsers } = useUserStore();
  const users = useUserStore((state) => state.users);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {

    const timeout = setTimeout(() => {

        fetchUsers(
            currentPage,
            10,
            searchKey,
            activeFilter
        );

    }, 400);

    return () => clearTimeout(timeout);

  }, [
      currentPage,
      searchKey,
      activeFilter
  ]);
      

    const totalPages = pagination.totalPages;

    const from =
      pagination.total === 0
        ? 0
        : (pagination.page - 1) * pagination.limit + 1;

    const to =
      Math.min(
        pagination.page * pagination.limit,
        pagination.total
      );

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

  // Get avatar gradient
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

  // Helper function to render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages
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
      // Show first 3 pages, ellipsis, current page, ellipsis, last 3 pages
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

      // Show pages around current
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

  return (
    <div className={`${theme.card.primary} ${theme.border} rounded-lg overflow-hidden mt-7`}>
      {/* Header - Search & Filter */}
      <div className={`
        flex flex-col md:flex-row md:items-center md:justify-between
        gap-3 p-4
        ${theme.table.divider}
        border-b
      `}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Users className={`h-5 w-5 ${theme.text.info} shrink-0`} />
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
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
            <input 
              type="text" 
              className={`
                w-full pl-9 pr-4 py-2.5
                ${theme.input.input}
                rounded-xl
                text-sm
                transition-all
                duration-200
              `}
              placeholder="Search by name or email"
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
                setCurrentPage(currentPage);
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
            <select 
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setCurrentPage(1);
              }} 
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
                min-w-[140px]
                transition-all
                duration-200
              `}
            >
              <option value="all">All Members</option>
              <option value="newer">Newest First</option>
              <option value="older">Oldest First</option>
              <option value="role">By Role</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
                <td colSpan="7" className="py-12 text-center">
                  <div className={theme.text.muted}>
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const role = user?.role === "user" ? "Member" : "Admin";
                const totalProjects = useUserState[user?.uid]?.projects || 0;
                const totalTasks = useUserState[user?.uid]?.tasks || 0;
                const avatarGradient = getAvatarGradient(user?.name);

                return (
                  <tr
                    key={user.uid}
                    className={`
                      ${theme.table.row}
                      ${theme.table.divider}
                      border-b
                      transition-all
                      duration-200
                      hover:shadow-md
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
                          hover:scale-105
                        `}>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className={`${theme.text.primary} font-medium text-sm truncate`}>
                            {user?.name || "Unknown User"}
                          </p>
                          <p className={`${theme.text.muted} text-xs truncate`}>
                            {user?.email || "No email"}
                          </p>
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
                        px-3 py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${theme.status.completed}
                      `}>
                        {totalProjects}
                      </span>
                    </td>

                    {/* Tasks */}
                    <td className="px-4 py-3.5">
                      <span className={`
                        px-3 py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${theme.status.review}
                      `}>
                        {totalTasks}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${theme.status.completed}
                        flex
                        items-center
                        gap-1.5
                        w-fit
                      `}>
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    </td>

                    {/* Joined */}
                    <td className={`px-4 py-3.5 ${theme.text.muted} text-sm`}>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
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
                          hover:scale-[1.02]
                          hover:shadow-lg
                          hover:shadow-blue-500/20
                          active:scale-[0.98]
                          inline-block
                          whitespace-nowrap
                        `}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className={`
          flex flex-col sm:flex-row items-center justify-between
          gap-3 p-4
          ${theme.table.divider}
          border-t
        `}>
          <span className={`${theme.text.muted} text-sm`}>
            Showing {from} - {to} of {pagination.total} members
          </span>

          <div className="flex items-center gap-1.5">
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

export default TeamDetailTable