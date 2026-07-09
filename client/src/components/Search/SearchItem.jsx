import { FolderOpen, ClipboardList, Users, History } from "lucide-react";

import { useNavigate } from "react-router-dom";

const SearchItem = ({ item, type }) => {
  const navigate = useNavigate();

  let Icon = FolderOpen;

  let title = "";

  let subtitle = "";

  let route = "/";

  switch (type) {
    case "project":
      Icon = FolderOpen;

      title = item.title;

      subtitle = item.description || "Project";

      route = `/projectflow/projects/${item.pid}`;

      break;

    case "task":
      Icon = ClipboardList;

      title = item.title;

      subtitle = item.project_name || item.status;

      route = `/projectflow/projects/${item.project_id}`;

      break;

    case "member":
      Icon = Users;

      title = item.name;

      subtitle = item.email;

      route = "/projectflow/team";

      break;

    case "activity":
      Icon = History;

      title = item.title;

      subtitle = item.message;

      route = "/projectflow/activity";

      break;

    default:
      break;
  }

  return (
    <button
      onClick={() => navigate(route)}
      className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-left
                hover:bg-neutral-800
                transition
                cursor-pointer
            "
    >
      <div
        className="
                    w-10
                    h-10
                    rounded-lg
                    bg-neutral-800
                    flex
                    items-center
                    justify-center
                "
      >
        <Icon size={18} className="text-blue-400" />
      </div>

      <div className="flex-1">
        <div
          className="
                        text-white
                        text-sm
                        font-medium
                        truncate
                    "
        >
          {title}
        </div>

        <div
          className="
                        text-xs
                        text-neutral-400
                        truncate
                    "
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
};

export default SearchItem;
