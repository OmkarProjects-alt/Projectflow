const { 
    searchMembersService,
    fetchUsers, 
    updateUserProfileService
} = require("../services/user.service");

const getUsers = async (req, res) => {
  const userId = req.user.uid;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const search = req.query.search || "";
  const sort = req.query.sort || "all";
  const projectId = req.query.projectId || "";

  const result = await fetchUsers(
    userId,
    page,
    limit,
    search,
    sort,
    projectId
  );

  res.status(200).json(result);
};

const searchProjectMembers = async (req, res) => {

    const { query, projectId } = req.query;

    const users = await searchMembersService(
        query,
        projectId
    );

    return res.status(200).json({
        success: true,
        users,
    });
};

const updateUserProfile = async (req, res) => {
    const userId = req.user.uid;

    const {
        name,
        about,
        location,
        role,
        skills,
    } = req.body;
    
   
    const result = await updateUserProfileService(
        userId,
        req,
    )

    console.log("result", result.rows[0]);

    if (result.rowCount === 0) {
        res.status(404);
        throw new Error("User not found.");
    }

    return res.status(200).json({
        success: true,
        message: "User data updated successfully.",
        user: result.rows[0],
    });
}

module.exports = {
    searchProjectMembers,
    getUsers,
    updateUserProfile
};