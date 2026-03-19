import { getGroupIdsBusiness, getGroupBusiness, changeGroupNameBusiness, deleteGroupBusiness } from '../business/groupBusiness.js';

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

export async function changeGroupName(req, res) {
    try {        
        let { id, name } = req.body;
        let data = changeGroupNameBusiness(id, name);


        res.status(200).json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false})
    }
}

export async function deleteGroup(req, res) {
    try {
        let {deleteGroupId} = req.params;
        await deleteGroupBusiness(deleteGroupId);

        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false});
    }
}