import React, { useState} from "react";
import { useTheme } from "../../context/ThemeProvider";
import CreateProjectModal from "../common/CreateProjectModal";
import CreateTaskModal from "../common/CreateTaskModal";
import { useUserContext } from "../../context/UserContext";

const DashboardHeader = ({ userName = "User" }) => {

  const { theme } = useTheme();

  const { userData } = useUserContext();

  const [openTaskCreateModal, setTaskCreateModal] = useState(false);
  const [openProjectCreateModal, setProjectCreateModal] = useState(false);



  return (
   <>

     {openProjectCreateModal && (
      <CreateProjectModal 
        open={openProjectCreateModal}
        onClose={() => setProjectCreateModal(!openProjectCreateModal)}
      />
     )}

     {openTaskCreateModal && (
      <CreateTaskModal 
        open={openTaskCreateModal}
        onClose={() => setTaskCreateModal(!openTaskCreateModal)}
      />
     )}



     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <div>
        <h1 className={`${theme.text.heading}`}>
          Welcome back, {userData?.name?.split(' ')[0]} 👋
        </h1>

        <p className={`${theme.text.secondary} mt-1`}>
          Manage your projects, tasks, and deadlines efficiently.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setTaskCreateModal(!openTaskCreateModal)}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition"
        >
          + New Task
        </button>

        <button
          onClick={() => setProjectCreateModal(!openProjectCreateModal)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
        >
          + New Project
        </button>
      </div>

    </div>
   </>
  );
};

export default DashboardHeader;