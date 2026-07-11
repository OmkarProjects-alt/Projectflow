import React from "react";
import CommonHeader from "../../common/CommonHeader";

const ProjectDetailHeader = ({ project, isOwner }) => {

  return (
    <div className="">
      <CommonHeader 
          title = {project?.title}
          description = {project?.description}
          status = {project?.status}
          deadline = {project?.deadline}
          progress = {project?.progress}
          project={project}
          from = "projectDetail"
          isOwner = {isOwner}
      />
    </div>
  );
};

export default ProjectDetailHeader;