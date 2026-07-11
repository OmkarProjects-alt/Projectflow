const { 
    inviteMembersService, 
    removeMemberService,
    fetchUserAssignedProjects,
    fetchAssignedProjectDetail,
} = require("../services/project.service");

const inviteMembers = async (req, res) => {

    const sender = {
        senderId: req.user.uid,
        senderName: req.user.name,
    };

    const members = await inviteMembersService(
        sender,
        req.body
    );

    let message;
    if (req.body.members.length === 1) {
        message = "Request sended to member."
    } else {
        message = "Request sended to members."
    }

    res.status(200).json({
        success: true,
        message: message,
        members,
    });

};


const removeMember = async (req, res) => {

    const result =
        await removeMemberService(
            {
                senderId: req.user.uid,
                senderName: req.user.name,
            },
            req.body
        );

    return res.status(200).json({
        success: true,
        message: result.message,
        removedUser: result.removedUser,
    });

};

const getUserAssignedProjects = async (req, res) => {

    const { userId } = req.params;

    const projects = await fetchUserAssignedProjects(userId);

    return res.status(200).json({
        success: true,
        projects: projects.rows,
    });

}

const getAssignedProjects = async (req, res) => {

    const userId = req.user.uid;

    const projects = await fetchUserAssignedProjects(userId);

    res.status(200).json({
        success: true,
        projects: projects.rows,
    });
}

const getAssignedProjectDetail = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.uid;

    const result = await fetchAssignedProjectDetail(projectId, userId);

    if (!result) {
        res.status(404);
        throw new Error("Project not found or you are not assigned to this project.");
    }

    res.status(200).json({
        success: true,
        project: result.project,
    });
}

module.exports = {
    inviteMembers,
    removeMember,
    getUserAssignedProjects,
    getAssignedProjects,
    getAssignedProjectDetail,
};