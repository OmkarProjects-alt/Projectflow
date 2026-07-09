import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import ProjectCard from './ProjectCard';
import { useProjectStore } from '../../../store/projectStore';
import { Filter, SortAsc, FolderKanban, X } from 'lucide-react';
import ProjectContainerSkeleton from './ProjectContainerSkeleton';

const ProjectContainer = () => {
  const { theme } = useTheme();
  const projects = useProjectStore((state) => state.MyProjects);
  const isLoading = useProjectStore((state) => state.loading);

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  let filteredProjects = [...projects];

  // Filter
  if (filter !== 'all') {
    filteredProjects = filteredProjects.filter(
      (project) =>
        project.status?.toLowerCase() === filter.toLowerCase()
    );
  }

  // Sort
  switch (sort) {
    case 'newest':
      filteredProjects.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      break;

    case 'oldest':
      filteredProjects.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      break;

    case 'deadline':
      filteredProjects.sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
      break;

    case 'progress':
      filteredProjects.sort(
        (a, b) => (b.progress || 0) - (a.progress || 0)
      );
      break;

    default:
      break;
  }

  // Clear all filters
  const clearFilters = () => {
    setFilter('all');
    setSort('newest');
  };

  // Get filter label
  const getFilterLabel = () => {
    const filterMap = {
      'all': 'All Projects',
      'active': 'Active',
      'planning': 'Planning',
      'on hold': 'On Hold',
      'completed': 'Completed'
    };
    return filterMap[filter] || 'All Projects';
  };

  // Get sort label
  const getSortLabel = () => {
    const sortMap = {
      'newest': 'Newest First',
      'oldest': 'Oldest First',
      'deadline': 'Nearest Deadline',
      'progress': 'Highest Progress'
    };
    return sortMap[sort] || 'Newest First';
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <ProjectContainerSkeleton />
      ) : projects?.length === 0 ? (
        <div className={`
          flex flex-col items-center justify-center
          h-full
          ${theme.text.muted}
          text-center
          py-16
        `}>
          <FolderKanban className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">
            No projects yet 🚀
          </p>
          <p className="text-sm mt-2">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">

          {/* Filters - Desktop */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className={`${theme.text.muted} text-sm`}>
                Showing <span className={theme.text.primary}>{filteredProjects.length}</span> of{' '}
                <span className={theme.text.primary}>{projects.length}</span> projects
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={16} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`
                    pl-10 pr-8 py-2.5
                    ${theme.input.select}
                    ${theme.text.primary}
                    cursor-pointer
                    appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                    bg-no-repeat
                    bg-size-[18px]
                    bg-position-[right_12px_center]
                    min-w-35
                  `}
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="on hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={16} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={`
                    pl-10 pr-8 py-2.5
                    ${theme.input.select}
                    ${theme.text.primary}
                    cursor-pointer
                    appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                    bg-no-repeat
                    bg-size-[18px]
                    bg-position-[right_12px_center]
                    min-w-40
                  `}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="deadline">Nearest Deadline</option>
                  <option value="progress">Highest Progress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className={`${theme.text.muted} text-sm`}>
                Showing <span className={theme.text.primary}>{filteredProjects.length}</span> projects
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2
                  px-3 py-1.5
                  rounded-lg
                  ${theme.button.secondary}
                  ${theme.text.primary}
                  text-sm
                  transition-all
                  duration-200
                `}
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-white/5 dark:bg-gray-800/20">
                <div className="relative">
                  <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={16} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`
                      w-full pl-10 pr-8 py-2.5
                      ${theme.input.select}
                      ${theme.text.primary}
                      cursor-pointer
                      appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                      bg-no-repeat
                      bg-size-[18px]
                      bg-position-[right_12px_center]
                    `}
                  >
                    <option value="all">All Projects</option>
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="on hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="relative">
                  <SortAsc className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={16} />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={`
                      w-full pl-10 pr-8 py-2.5
                      ${theme.input.select}
                      ${theme.text.primary}
                      cursor-pointer
                      appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                      bg-no-repeat
                      bg-size-[18px]
                      bg-position-[right_12px_center]
                    `}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="deadline">Nearest Deadline</option>
                    <option value="progress">Highest Progress</option>
                  </select>
                </div>

                {/* Active Filters */}
                {(filter !== 'all' || sort !== 'newest') && (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-xs ${theme.text.muted}`}>Active filters:</span>
                    {filter !== 'all' && (
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${theme.status.todo}
                        flex items-center gap-1
                      `}>
                        {getFilterLabel()}
                        <button
                          onClick={() => setFilter('all')}
                          className="hover:opacity-70"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {sort !== 'newest' && (
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${theme.status.progress}
                        flex items-center gap-1
                      `}>
                        {getSortLabel()}
                        <button
                          onClick={() => setSort('newest')}
                          className="hover:opacity-70"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className={`text-xs ${theme.text.info} hover:underline`}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Active filters indicator for mobile */}
            {(filter !== 'all' || sort !== 'newest') && !showFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {filter !== 'all' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.status.todo}`}>
                    {getFilterLabel()}
                  </span>
                )}
                {sort !== 'newest' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.status.progress}`}>
                    {getSortLabel()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.pid}
                project={project}
                index={index}
              />
            ))}
          </div>

          {/* No Matching Results */}
          {filteredProjects.length === 0 && (
            <div className={`
              text-center
              py-16
              ${theme.text.muted}
            `}>
              <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-lg font-medium">
                No projects match the selected filter
              </p>
              <button
                onClick={clearFilters}
                className={`text-sm ${theme.text.info} hover:underline mt-2`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectContainer;