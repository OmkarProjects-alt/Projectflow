import { useEffect, useRef, useState } from "react";
import CreateProjectModal from "./CreateProjectModal";
import CreateTaskModal from "./CreateTaskModal";

export default function CreateDropdown() {
  const [open, setOpen] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
        { openProjectModal && 
            <CreateProjectModal
                open = {openProjectModal}
                onClose = {() => {setOpenProjectModal(!openProjectModal)}}
            /> 
        }

        { openTaskModal &&
            <CreateTaskModal 
                open={openTaskModal}
                onClose={() => { setOpenTaskModal(!openTaskModal) }}
            />
        }

        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white"
            >
                + Create
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl">
                <button 
                    className="block w-full px-4 py-3 text-left hover:bg-neutral-700"
                    onClick={() => setOpenProjectModal(!openProjectModal)}
                >
                    New Project
                </button>

                <button 
                    className="block w-full px-4 py-3 text-left hover:bg-neutral-700"
                    onClick={() => setOpenTaskModal(!openTaskModal)}
                >
                    New Task
                </button>
                </div>
            )}
        </div>
    </>
  );
}