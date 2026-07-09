const { globalSearchService } = require("../services/search.service");

const globalSearch = async (req, res) => {

    const query = req.query.query?.trim() || "";

    const result = await globalSearchService(
        req.user.uid,
        query
    );

    res.status(200).json({
        success: true,
        results: result
    });

};

module.exports = {
    globalSearch
};