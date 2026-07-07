import { useState } from "react";
import { ChevronDown, Pencil } from 'lucide-react'
import { useTaskStore } from "../../store/tasksStore";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import { updateStatus } from "../../services/task.service";


const statuses = [
  {
    label: "To Do",
    value: "Todo",
    className: "text-slate-300 hover:bg-slate-500/20",
  },
  {
    label: "In Progress",
    value: "In Progress",
    className: "text-blue-400 hover:bg-blue-500/20",
  },
  {
    label: "Review",
    value: "Review",
    className: "text-purple-400 hover:bg-purple-500/20",
  },
];

export function useUpdateStatus () {
     const updateMyTask = useTaskStore((state) => state.updateMyTask);
     
     const { addMessage } = useError();
      return async (taskId, status) => {
        try {
          const result = await updateStatus(taskId, status)

          if(result?.data?.success) {
            addMessage(result?.data?.message, true);
            updateMyTask(result?.data.task);
            console.log("my task here", result?.data?.task)
          }

        } catch (error) {
          addMessage(error?.response?.data?.message || error?.message);
        }
      }
    }

export function StatusDropdown({
  currentStatus,
  onStatusChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          bg-neutral-800
          hover:bg-neutral-700
          text-white
          transition
          cursor-pointer
        "
      >
        <Pencil size={16} />
        Change Status
        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-48
            bg-neutral-900
            border border-neutral-700
            rounded-xl
            shadow-xl
            overflow-hidden
            z-50
          "
        >
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                onStatusChange(status.value);
                setOpen(false);
              }}
              className={`
                w-full
                text-left
                px-4
                py-3
                transition
                ${status.className}
                ${
                  currentStatus === status.value
                    ? "bg-neutral-800"
                    : ""
                }
              `}
            >
              {status.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}