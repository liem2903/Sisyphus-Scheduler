
import { getFriendsData, postFriendRequestData, setFriendRequestData } from '../data_access/friendRepository.js'

export function getFriendsBusiness(user_id) {
    try {
        return getFriendsData(user_id)
    } catch (err) {
        throw new Error("Error in data-base");
    }
}

export function postFriendRequestBusiness(user_id, send_id) {
    try {
        return postFriendRequestData(user_id, send_id);
    } catch (err) {
        throw new Error("Error in data-base");
    }
}

export function setFriendRequestBusiness(user_id, send_id) {
    try {
        return setFriendRequestData(user_id, send_id);
    } catch (err) {
        throw new Error("Error in data-base");
    }
}