import { useState, useRef, useEffect } from "react";
import CreateDropdown from "./common/CreateDropdown";
import { Menu, MoonStar, Sun, Bell, Search, X, User } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import gsap from "gsap";
import { useNotificationStore } from "../store/notificationStore";
import NotificationSidebar from "./NotificationSidebar";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function Navbar({ setSidebarOpen }) {
  const [search, setSearch] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { dark, setDark, theme } = useTheme();

  const user = useUserStore((state) => state.user);
  
  const {
      unreadCount,
      fetchNotifications,
  } = useNotificationStore();

  const buttonRef = useRef(null);
  const revealRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleThemeToggle = () => {
    const rect = buttonRef.current.getBoundingClientRect();

    const revealColor = dark
    ? "#ffffff"
    : "#030817";

    gsap.set(revealRef.current, {
      left: rect.left + rect.width/2,
      top: rect.top + rect.height/2,
      width: 20,
      height: 20,
      xPercent: -50,
      yPercent: -50,
      backgroundColor: revealColor,
      borderRadius: "50%"
    });

    gsap.to(revealRef.current, {
      width: 3000,
      height: 3000,
      duration: 1,
      ease: "power3.inOut",
      onStart() {
        setTimeout(() => {
          setDark(prev => !prev);
        }, 350);
      },
      onComplete() {
        gsap.set(revealRef.current, {
          width: 0,
          height: 0
        });
      }
    });
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearch("");
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearch("");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {openNotification && (
        <NotificationSidebar 
          open={openNotification}
          onClose={() => setOpenNotification(false)}
        />
      )}

      <nav className={`h-16 w-full ${theme.layout.navbar} ${theme.text.primary} z-20 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 transition-all duration-300 relative`}>
        
        {/* Left Section - Menu + Logo */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} className={theme.text.secondary} />
          </button>

          <Link to="/projectflow/dashboard" className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
              PF
            </div>
            <span className={`font-semibold ${theme.text.primary} hidden md:inline`}>
              ProjectFlow
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search projects, tasks, members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-9 pr-4 py-2 text-sm ${theme.input.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${searchFocused ? 'ring-2 ring-blue-500/50' : ''}`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.text.muted} hover:${theme.text.primary} transition-colors`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={handleSearchToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle search"
          >
            <Search size={20} className={theme.text.secondary} />
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 md:hidden p-4 bg-[#0a0f1d] border-b border-gray-800 shadow-xl">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search projects, tasks, members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 text-sm ${theme.input.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
              <button
                onClick={handleSearchClose}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.text.muted} hover:${theme.text.primary} transition-colors`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          
          {/* Theme Toggle */}
          <button
            ref={buttonRef}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-200/20 dark:hover:bg-gray-800/50 ${theme.text.secondary}`}
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={20} /> : <MoonStar size={20} />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              setOpenNotification(true);
              fetchNotifications();
            }}
            className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className={theme.text.secondary} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold min-w-5 h-5 px-1 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <Link
            to="/projectflow/profile"
            className="flex items-center gap-2 cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform">
              {getInitials(user?.name || "Omkar")}
            </div>
            <div className="hidden sm:block text-sm">
              <p className={`font-medium ${theme.text.primary} truncate max-w-24`}>
                {user?.name || "Omkar"}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>
                {user?.role || "Admin"}
              </p>
            </div>
          </Link>

          {/* Create Dropdown */}
          <div className="hidden sm:block">
            <CreateDropdown />
          </div>
        </div>
      </nav>

      <div
        ref={revealRef}
        className="fixed pointer-events-none rounded-full"
      />
    </>
  );
}