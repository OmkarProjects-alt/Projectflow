const { 
    fetchActivities,
    getActivitiesService,
} = require('../services/activity.service');

const getActivities = async (req, res) => {

    const result = await fetchActivities(req.user.uid, req.query);

    if(result) {
        return res.status(200).json({
            success: true,
            activities: result.activities,
            pagination: result.pagination,
        });
    }
}

const getActivitiesController = async (req, res) => {

    const result = await getActivitiesService(req.query);

    return res.status(200).json({
        success: true,
        ...result
    });

};

module.exports ={
    getActivities,
    getActivitiesController
}