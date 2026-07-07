const { 
    searchMembersService,
    fetchUsers, 
} = require("../services/user.service");

const getUsers = async (req, res) => {
  const userId = req.user.uid;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const search = req.query.search || "";
  const sort = req.query.sort || "all";

  const result = await fetchUsers(
    userId,
    page,
    limit,
    search,
    sort
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

module.exports = {
    searchProjectMembers,
    getUsers,
};