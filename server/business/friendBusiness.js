
import { getFriendsData, postFriendRequestData, setFriendRequestData, getFriendRequestsData, createFriend, isFriendedData, changeFriendNameRepository, getChangedUserName, checkUniqueName, getLastSeen, isFriends, getBusyPeriods } from '../data_access/friendRepository.js'
import { getUserName } from '../data_access/userRepository.js';
import { getRefreshToken, refreshAccessToken } from '../data_access/authRepository.js';
import { DateTime } from 'luxon';
import { redis } from '../redis.js';

export async function getFriendsBusiness(user_id, google_id, time_zone) {
    try {        
        const id = await getFriendsData(user_id);
        
        const friendNames = await Promise.all(id.map(async (user) => {
            return getFriendsHelper(user, google_id, time_zone, user_id);
        }));

        return friendNames;
    } catch (err) {
        console.log(err.message);
        throw new Error("Error in data-base");
    }
}

export async function getLastSeenBusiness(change_friend_name, google_id, time_zone) {
    let time_max = DateTime.now().setZone(time_zone).toISO();
    let last_seen = await getLastSeen(change_friend_name, google_id, time_max);

    console.log(last_seen);
    
    let regex = /([0-9]{4})-([0-9]{2})-([0-9]{2})/

    if (!last_seen.status) {
        return {
            last_seen: "Untracked",
            status: "Red"
        }
    }

    let date = last_seen.start.toString().match(regex);
    let year = parseInt(date[1]);
    let month = parseInt(date[2].toString());
    let day = parseInt(date[3]);

    let date_time = DateTime.fromObject({day: day, year: year, month: month});
    last_seen = Math.floor(DateTime.now().diff(date_time).as('days'));
    
    let status = ""
    if (last_seen > 30) {
        status = "Red";
    } else if (last_seen > 14) {
        status = "Orange";
    } else {
        status = "Green";
    }
    
    return {
        last_seen: last_seen.toString(),
        status
    }
}

async function getFriendsHelper(user, google_id, time_zone, user_id) {    
    let friends = await getUserName(user.friend_id);
    let change_friend_name = await getChangedUserName(user_id, user.friend_id);
    let time_max = DateTime.now().setZone(time_zone).toISO();

    let last_seen = await getLastSeen(change_friend_name, google_id, time_max);
    let regex = /([0-9]{4})-([0-9]{2})-([0-9]{2})/
    
    if (!last_seen.status) {
        return {
            name: friends.name,
            id: user.friend_id,
            changed_name: change_friend_name,
            last_seen: "Untracked",
            status: "Red"
        }
    }

    let date = last_seen.start.toString().match(regex);
    let year = parseInt(date[1]);
    let month = parseInt(date[2].toString());
    let day = parseInt(date[3]);

    let date_time = DateTime.fromObject({day: day, year: year, month: month});
    last_seen = Math.floor(DateTime.now().diff(date_time).as('days'));
    
    let status = ""
    if (last_seen > 30) {
        status = "Red";
    } else if (last_seen > 14) {
        status = "Orange";
    } else {
        status = "Green";
    }
    
    return {
        name: friends.name,
        id: user.friend_id,
        changed_name: change_friend_name,
        last_seen: last_seen.toString(),
        status
    }
}

export async function postFriendRequestBusiness(user_id, code) {
    let isFriended = await isFriendedData(user_id, code);

    if (isFriended.exists) {
        throw new Error(isFriended.message);
    }

    return postFriendRequestData(user_id, code);
}

export async function setFriendRequestBusiness(status, id, friend, current_user) {
    try {
        setFriendRequestData(status, id);

        if (status == "Accepted") {
            let friend_name = await getUserName(friend); 
            let user_name = await getUserName(current_user);

            createFriend(friend, current_user, friend_name.name);
            createFriend(current_user, friend, user_name.name)
        }
    } catch (err) {
        console.log("ERROR IN DATABASE");
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

export async function changeFriendNameBusiness(user_id, id, name) {
    if (!(await checkUniqueName(user_id, name.trim().toLowerCase()))) {  
        throw new Error("A friend already has this name");
    }

    return changeFriendNameRepository(user_id, id, name.trim().toLowerCase());
}

export async function getAvailabilitiesBusiness(my_id, my_google_id, friend_id) {
    try {
        // Have to think about what defines an available time --> I am probs gonna say two hours of free time.
        isFriends(my_id, friend_id); 

         // Maybe can class into WHOLE DAY FREE vs like not whole day.
        const { expiry_time, time_zone } = await redis.get(`google:access:${friend_id}`);

        if (Date.now() >= expiry_time) {
            const refresh_token = await getRefreshToken(friend_id);  
            
            const { access_token, expires_in } = await refreshAccessToken(refresh_token);
            const expiry_time = Date.now() + expires_in * 1000;
            
            await redis.set(`google:access:${friend_id}`, { access_token, expiry_time, time_zone })
        } 

        const { access_token } = await redis.get(`google:access:${friend_id}`);
        
        let friends_busy = await getBusyPeriods(access_token, time_zone); 
        let my_busy = await getBusyPeriods(my_google_id, time_zone);

        let available = [...friends_busy, ...my_busy];

        return available;
    } catch (err) {
        return
    }
}