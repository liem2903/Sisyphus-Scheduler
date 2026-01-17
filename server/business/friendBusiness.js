
import { getFriendsData, postFriendRequestData, setFriendRequestData, getFriendRequestsData, deleteFriendRequestData, createFriend } from '../data_access/friendRepository.js'
import { getUserName } from '../data_access/userRepository.js';

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

export function setFriendRequestBusiness(status, id, friend, current_user) {
    try {
        console.log(status);
        console.log(id);
        console.log(friend);
        console.log(current_user);

        setFriendRequestData(status, id);

        if (status == "Accept") {
            createFriend(friend, current_user);
        }
    } catch (err) {
        throw new Error("Error in data-base");
    }
}

export async function getFriendRequestsBusiness(user_id) {
    try {
        let friendRequests = await getFriendRequestsData(user_id);
        let final_requests = await Promise.all(friendRequests.map( async (value) => {
            let userName = (await getUserName(value.from_user)).name;

            return {
                from_user: value.from_user,
                to_user: value.to_user,
                status: value.status,
                id: value.id,
                requester_name: userName
            }
        }));

        return final_requests;
    } catch (err) {
        throw new Error("Error in data-base");
    }
}