import dotenv from 'dotenv';
import { 
    getFriendsBusiness,
    postFriendRequestBusiness,
    setFriendRequestBusiness,
    getFriendRequestsBusiness,
    changeFriendNameBusiness,
    getLastSeenBusiness,
    getAvailabilitiesBusiness,
    getFriendFromNameBusiness,
    createFriendGroupBusiness,
    getGroupAvailabilitiesBusiness
} from '../business/friendBusiness.js';
dotenv.config();

export async function getFriends(req, res) {
    try {
        let user_id = req.user.user_id;
        let google_id = req.access_token;     
        let time_zone = req.time_zone;

        let friends = await getFriendsBusiness(user_id, google_id, time_zone);
        res.status(200).json({status: true, data: friends})
    } catch (err) {
        res.status(400).json({status: false});
    }
}

export async function getLastSeenControl(req, res) {
    try {
        let google_id = req.access_token;
        let time_zone = req.time_zone;
        let { name } = req.query;

        let friends = await getLastSeenBusiness(name, google_id, time_zone);

        res.status(200).json({status: true, data: friends})
    } catch (err) {
        res.status(400).json({status: false});
    }
}

export async function getFriendRequests(req, res) {
    try {
        let user_id = req.user.user_id;        
        let requests = await getFriendRequestsBusiness(user_id);

        res.status(200).json({status: true, data: requests});
    } catch (err) {
        res.status(400).json({status: false})
    }
}

export async function postFriendRequest(req, res) {
    try {
        let user_id = req.user.user_id;
        let { code } = req.body;
        await postFriendRequestBusiness(user_id, code);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false, error: err.message})
    }
}

export async function declineFriendRequest(req, res) {
    try {
        let { id } = req.body;

        setFriendRequestBusiness("Declined", id, null, null);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        let { id, from_user } = req.body;
        let current_user = req.user.user_id;
        setFriendRequestBusiness("Accepted", id, from_user, current_user);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
    }
}

export async function changeFriendName(req, res) {
    try {
        let user_id = req.user.user_id;
        const { id, name } = req.body;
        await changeFriendNameBusiness(user_id, id, name);

        res.status(200).json({status: true})
    } catch (err) {                        
        res.status(400).json({status: false, error: err.message})
    }
}

export async function getAvailabilities(req, res) {
    try {
        let my_id = req.user.user_id;
        let my_google_id = req.access_token;    
        
        let { friend_id, start_date, end_date } = req.query;
        
        // Pass into big boy business logic
        let data = await getAvailabilitiesBusiness(my_id, my_google_id, friend_id, start_date, end_date);        
        
        res.status(200).json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false, error: err.message})
    }
}

export async function getGroupAvailabilities(req, res) {
    try {
        let my_id = req.user.user_id;
        let my_google_id = req.access_token;
        let own_time_zone = req.time_zone;

        let { friend_ids, start_date, end_date } = req.query;
        let actual_friend_ids = JSON.parse(friend_ids);

        let data = await getGroupAvailabilitiesBusiness(my_id, my_google_id, actual_friend_ids, start_date, end_date, own_time_zone);

        
        res.status(200).json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false, error: err.message});
    }
}

export async function getFriendFromName(req, res) {
    try {   
        let my_id = req.user.user_id;
        let { name, exact } = req.query;
        const actualExact = exact === "true";          

        let friends = await getFriendFromNameBusiness(my_id, name, actualExact);
        res.status(200).json({status: true, friends: friends});
    } catch (err) {
        res.status(400).json({status: false, error: err.message});
    }
}

export async function createFriendGroup(req, res) {
    try {
        let my_id = req.user.user_id;
        let { groupName, friend } = req.body;
        createFriendGroupBusiness(groupName, friend, my_id);

        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false, error: err.message})
    }
}