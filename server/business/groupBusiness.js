import { getGroupIdsData, getGroupDataId, getGroupNameData, changeGroupNameData } from '../data_access/groupRepository.js'; 

export async function getGroupIdsBusiness(user_id) {
    try {
        return await getGroupIdsData(user_id);
    } catch (err) {
        console.log(err.message);
    }
}

export async function getGroupBusiness(group_id) {
    try {
        let group_name = (await getGroupNameData(group_id))[0].group_name;
        let temp_ids = await getGroupDataId(group_id);
        let user_ids = [];

        temp_ids.map((id) => {
            user_ids.push(id.friend_id);
        });

        return {
            group_name,
            user_ids
        }
     } catch (err) {
        console.log(err.message);
    }
}

export async function changeGroupNameBusiness(id, newName) {
    try {
        return changeGroupNameData(id, newName);
    } catch (err) {
        console.log(err.message);
    }
}