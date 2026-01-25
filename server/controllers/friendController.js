import dotenv from 'dotenv';
import { getFriendsBusiness, postFriendRequestBusiness, setFriendRequestBusiness, getFriendRequestsBusiness, changeFriendNameBusiness } from '../business/friendBusiness.js';
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

export async function getFriendRequests(req, res) {
    try {
        let user_id = req.user.user_id;        
        let requests = await getFriendRequests(user_id);

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
