
import { getFriendsData, postFriendRequestData, setFriendRequestData, getFriendRequestsData } from '../data_access/friendRepository.js'

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

export function getFriendRequestsBusiness(user_id) {
    try {
        return getFriendRequestsData(user_id);
    } catch (err) {
        throw new Error("Error in data-base");
    }
}