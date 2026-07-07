import { NavLink } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  KanbanSquare,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { userData } = useUserContext();
  const { dark, theme } = useTheme();

  const menuItems = [
    {
      path: "/projectflow/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/projectflow/projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      path: "/projectflow/tasks",
      label: "Tasks",
      icon: CheckSquare,
    },
    {
      path: "/projectflow/kanban",
      label: "Kanban Board",
      icon: KanbanSquare,
    },
    {
      path: "/projectflow/team",
      label: "Team",
      icon: Users,
    },
    {
      path: "/projectflow/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-screen
          w-64
          ${theme.layout.sidebar}
          ${theme.text.primary}
          z-40
          transform
          transition-transform
          duration-300
          flex
          flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className={`h-16 ${theme.table.divider} flex items-center px-5 relative`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg">
                PF
              </div>

              <div className="ml-3">
                <h2 className={`font-bold ${theme.text.primary}`}>
                  ProjectFlow
                </h2>

                <p className={`text-xs ${theme.text.muted}`}>
                  Workspace
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={22} className={theme.text.secondary} />
            </button>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <p className={`text-xs uppercase tracking-widest ${theme.text.muted}`}>
            Workspace
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
                    px-4 py-3
                    rounded-xl
                    transition-all duration-200
                    ${theme.text.primary}
                    ${
                      isActive
                        ? `bg-blue-600 text-white shadow-lg shadow-blue-600/20`
                        : `hover:bg-gray-200/20 dark:hover:bg-gray-800/50 ${theme.text.secondary}`
                    }
                    `
                }
              >
                <Icon size={20} className="flex-shrink-0" />

                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`${theme.table.divider} p-3 space-y-3`}>
          {/* Logout Button */}
          <button
            className={`
              w-full
              flex
              items-center
              justify-center
              gap-2
              ${theme.button.danger}
              rounded-lg
              py-2.5
              text-sm
              font-medium
              transition-all
              duration-200
              hover:scale-[1.02]
              active:scale-[0.98]
            `}
            aria-label="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* User Profile */}
          <Link
            to={`/projectflow/user/${userData?.uid}`}
            className={`
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              transition-all
              duration-200
              hover:bg-gray-200/20
              dark:hover:bg-gray-800/50
              cursor-pointer
              group
            `}
          >
            <div
              className={`
                w-10 h-10
                rounded-full
                bg-gradient-to-br
                from-blue-500 to-blue-700
                flex
                items-center
                justify-center
                font-semibold
                text-white
                shadow-md
                flex-shrink-0
                transition-transform
                duration-200
                group-hover:scale-105
              `}
            >
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${theme.text.primary}`}>
                {userData?.name || "User"}
              </p>

              <p className={`text-xs ${theme.text.muted} truncate`}>
                {userData?.email || "user@email.com"}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}