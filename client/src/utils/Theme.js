
export const themes = {
  dark: {
    // =========================
    // Layout
    // =========================
    layout: {
      background: "bg-[#030817]",
      page: "bg-[#0a0f1d]",
      sidebar: "bg-[#111522] border-r border-gray-800",
      navbar:
        "bg-[#161a27ea] border-b border-gray-800 backdrop-blur-xl",
      footer: "bg-[#111522] border-t border-gray-800",
    },

    // =========================
    // Card / Containers
    // =========================
    card: {
      primary:
        "bg-[#151b2798] border rounded-xl",
      secondary:
        "bg-[#1b2234] border rounded-xl",
      hover:
        "hover:border-blue-500 transition-all duration-300",
      modal:
        "bg-[#151b27] border border-gray-800 rounded-2xl shadow-2xl",
    },

    // =========================
    // Text
    // =========================
    text: {
      primary: "text-white",
      secondary: "text-neutral-400",
      muted: "text-neutral-500",
      heading: "text-white font-bold text-3xl",
      heading2: "text-white font-semibold",
      danger: "text-red-400",
      success: "text-green-400",
      warning: "text-amber-400",
      info: "text-blue-400",
    },

    // =========================
    // Inputs
    // =========================
    input: {
      input:
        "bg-[#151b275e] border border-gray-700 rounded-lg text-white placeholder:text-neutral-500 focus:border-blue-500 outline-none",

      textarea:
        "bg-[#151b275e] border border-gray-700 rounded-lg text-white resize-none placeholder:text-neutral-500",

      select:
        "bg-[#151b275e] border border-gray-700 rounded-lg text-white",

      checkbox:
        "accent-blue-600",

      search:
        "bg-[#111827] border border-gray-700 rounded-xl text-white",
    },

    // =========================
    // Buttons
    // =========================
    button: {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition",

      secondary:
        "bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition",

      success:
        "bg-green-600 hover:bg-green-700 text-white rounded-lg",

      danger:
        "bg-red-600 hover:bg-red-700 text-white rounded-lg",

      warning:
        "bg-amber-500 hover:bg-amber-600 text-black rounded-lg",

      outline:
        "border border-gray-700 hover:bg-gray-800 rounded-lg",

      ghost:
        "hover:bg-gray-800 rounded-lg",
    },

    // =========================
    // Tables
    // =========================
    table: {
      table:
        "bg-[#151b2798] border border-gray-800",
      header:
        "bg-[#161d28c0]",
      row:
        "hover:bg-[#1d2435]",
      divider:
        "border-gray-800",
    },

    // =========================
    // Status
    // =========================
    status: {
      todo:
        "bg-slate-500/20 text-slate-300",

      progress:
        "bg-blue-500/20 text-blue-400",

      review:
        "bg-purple-500/20 text-purple-400",

      completed:
        "bg-green-500/20 text-green-400",

      overdue:
        "bg-red-500/20 text-red-400",
    },

    // =========================
    // Priority
    // =========================
    priority: {
      high:
        "bg-red-500/20 text-red-400",

      medium:
        "bg-amber-500/20 text-amber-400",

      low:
        "bg-green-500/20 text-green-400",
    },

    // =========================
    // Kanban
    // =========================
    kanban: {
      todo: "border-neutral-600",
      progress: "border-blue-500",
      review: "border-amber-500",
      completed: "border-green-500",
    },

    border: "border border-gray-800",

    // =========================
    // Avatar Colors
    // =========================
    avatar: [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ],

    // =========================
    // Charts
    // =========================
    chart: {
      blue: "#3B82F6",
      green: "#22C55E",
      amber: "#F59E0B",
      red: "#EF4444",
      purple: "#A855F7",
      gray: "#6B7280",
    },
  },

  light: {
    layout: {
      background: "bg-gray-100",
      page: "bg-gray-100",
      sidebar:
        "bg-white border-r border-gray-200 shadow-sm",
      navbar:
        "bg-white border-b border-gray-200 shadow-sm",
      footer:
        "bg-white border-t border-gray-200",
    },

    card: {
      primary:
        "bg-white border rounded-xl",
      secondary:
        "bg-gray-50 border rounded-xl",
      hover:
        "hover:border-blue-500 transition-all duration-300",
      modal:
        "bg-white border border-gray-200 rounded-2xl shadow-xl",
    },

    border: "border border-gray-200 shadow-xl",

    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      muted: "text-gray-500",
      heading: "text-gray-900 font-bold text-3xl",
      heading2: "text-gray-900 font-semibold",
      danger: "text-red-600",
      success: "text-green-600",
      warning: "text-amber-600",
      info: "text-blue-600",
    },

    input: {
      input:
        "bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400",

      textarea:
        "bg-white border border-gray-300 rounded-lg text-gray-900",

      select:
        "bg-white border border-gray-300 rounded-lg text-gray-900",

      checkbox:
        "accent-blue-600",

      search:
        "bg-white border border-gray-300 rounded-xl text-gray-900",
    },

    button: {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",

      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg",

      success:
        "bg-green-600 hover:bg-green-700 text-white rounded-lg",

      danger:
        "bg-red-600 hover:bg-red-700 text-white rounded-lg",

      warning:
        "bg-amber-500 hover:bg-amber-600 text-black rounded-lg",

      outline:
        "border border-gray-300 hover:bg-gray-100 rounded-lg",

      ghost:
        "hover:bg-gray-100 rounded-lg",
    },

    table: {
      table:
        "bg-white border border-gray-200",
      header:
        "bg-gray-50",
      row:
        "hover:bg-gray-50",
      divider:
        "border-gray-200",
    },

    status: {
      todo: "bg-gray-200 text-gray-700",
      progress: "bg-blue-100 text-blue-700",
      review: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
    },

    priority: {
      high: "bg-red-100 text-red-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-green-100 text-green-700",
    },

    kanban: {
      todo: "border-gray-400",
      progress: "border-blue-500",
      review: "border-amber-500",
      completed: "border-green-500",
    },

    avatar: [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ],

    chart: {
      blue: "#3B82F6",
      green: "#22C55E",
      amber: "#F59E0B",
      red: "#EF4444",
      purple: "#A855F7",
      gray: "#9CA3AF",
    },
  },
};