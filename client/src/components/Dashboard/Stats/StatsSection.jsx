import StatCard from "./StatCard";
import { useProjectStore } from "../../../store/projectStore";
import { useTaskStore } from "../../../store/tasksStore";
import CommonCards from '../../common/CommonCards'

const StatsSection = () => {

  const projects = useProjectStore(
    (state) => state.MyProjects
  );

  const tasks = useTaskStore(
    (state) => state.MyTasks
  );

  const totalProjects = projects?.length;

  const totalTasks = tasks?.length;

  const completedTasks = tasks?.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks?.filter(
    (task) => task.status !== "Completed"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      <CommonCards
        title="Projects"
        value={totalProjects}
        textColor="text-blue-500"
        subtitle="Total project You created"
      />

      <CommonCards
        title="Tasks"
        value={totalTasks || 0}
        textColor="text-purple-500"
        subtitle="Total task's that you assign"
      />

      <CommonCards
        title="Completed"
        value={completedTasks || 0}
        textColor="text-green-500"
        trend={"up"}
        subtitle="Total completed tasks"
      />

      <CommonCards
        title="Pending"
        value={pendingTasks || 0}
        textColor="text-orange-500"
        trend="low"
      />

    </div>
  );
};

export default StatsSection;