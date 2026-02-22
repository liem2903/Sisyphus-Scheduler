import { getGroupIdsBusiness, getGroupBusiness } from '../business/groupBusiness.js';

export async function getGroup(req, res) {
    try {
        let { group_id } = req.query;

        let data = await getGroupBusiness(group_id);                   
        res.status(200).json({status: true, data}); 
    } catch (err) {
        res.status(400).json({status: false});
    }
}

export async function getGroupIds(req, res) {
    try {
        let user_id = req.user.user_id;
        let data = await getGroupIdsBusiness(user_id);

        res.status(200).json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false});
    }
}