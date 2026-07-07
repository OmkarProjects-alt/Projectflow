import React from "react";
import RecentProjects from "./FooterSection/RecentProjects";
import UpcomingDeadlines from "./FooterSection/UpcomingDeadlines";
import MyTasks from "./FooterSection/MyTasks";

const BottomSection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <MyTasks />
      <RecentProjects />
      <UpcomingDeadlines />
    </div>
  );
};

export default BottomSection;