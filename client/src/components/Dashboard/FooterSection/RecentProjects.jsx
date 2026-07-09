import React, { useState, useMemo } from "react";
import { useProjectStore } from "../../../store/projectStore";
import { useTheme } from "../../../context/ThemeProvider";
import { FolderKanban, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const RecentProjects = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const projects = useProjectStore((state) => state.MyProjects);
  const loading = useProjectStore((state) => state.loading);

  const FilteredProjects = useMemo(() => {
    if (filter === "all") return projects;

    return projects.filter((project) => project.status === filter);
  }, [filter, projects]);

  const getProjectStatus = (status) => {
    switch (status) {
      case "active":
        return {
          color: theme.text.success,
          label: "Active"
        };
      case "planning":
        return {
          color: theme.text.info,
          label: "Planning"
        };
      case "on-hold":
        return {
          color: theme.text.warning,
          label: "On Hold"
        };
      case "completed":
        return {
          color: theme.text.success,
          label: "Completed"
        };
      case "cancelled":
        return {
          color: theme.text.danger,
          label: "Cancelled"
        };
      default:
        return {
          color: theme.text.muted,
          label: status || "Unknown"
        };
    }
  };

  const filterOptions = [
    { value: "all", label: "All Projects" },
    { value: "active", label: "Active" },
    { value: "planning", label: "Planning" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === filter);
    return option ? option.label : "All Projects";
  };

  return (
    <div className={`${theme.card.primary} ${theme.border} p-5`}>
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className={`h-5 w-5 ${theme.text.info}`} />
          <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
            Recent Projects
          </h3>
          <span className={`text-xs ${theme.text.muted} bg-white/5 px-2 py-0.5 rounded-full`}>
            {projects?.length || 0}
          </span>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`
              flex items-center gap-2
              px-3 py-1.5
              text-sm
              ${theme.input.select}
              ${theme.text.secondary}
              rounded-lg
              transition-all
              duration-200
              hover:border-gray-600
            `}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{getCurrentFilterLabel()}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showFilterDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilterDropdown(false)}
              />
              <div className={`
                absolute right-0 mt-1
                min-w-40
                py-1
                ${theme.card.secondary}
                rounded-lg
                shadow-lg
                z-20
                overflow-hidden
              `}>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`
                      w-full
                      px-4 py-2
                      text-sm
                      text-left
                      transition-all
                      duration-200
                      ${filter === option.value 
                        ? `${theme.text.primary} bg-blue-500/10` 
                        : `${theme.text.secondary} hover:bg-white/5`
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2">
        {FilteredProjects?.length === 0 ? (
          <div className={`${theme.text.muted} text-center py-8`}>
            <FolderKanban className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No projects found</p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className={`text-xs ${theme.text.info} hover:underline mt-1`}
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          FilteredProjects.slice(0, 5).map((project) => {
            const status = getProjectStatus(project?.status);

            return (
              <Link
                to={`/projectflow/projects/${project?.pid}`}
                key={project?.pid}
                className={`
                  flex items-center justify-between
                  p-3 rounded-lg
                  ${theme.card.hover}
                  transition-all
                  duration-200
                  cursor-pointer
                  group
                `}
              >
                <div className="flex-1 min-w-0">
                  <p className={`${theme.text.primary} font-medium truncate group-hover:text-blue-400 transition-colors duration-200`}>
                    {project?.title || "Untitled Project"}
                  </p>
                  {project?.description && (
                    <p className={`${theme.text.muted} text-xs truncate mt-0.5`}>
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${status.color} bg-white/5`}>
                    {status?.label}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* View All Link */}
      {FilteredProjects?.length > 5 && (
        <div className="mt-3 text-center">
          <button
            className={`text-sm ${theme.text.info} hover:underline transition-all duration-200`}
            onClick={() => {/* Navigate to projects page */}}
          >
            View all {FilteredProjects.length} projects
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;