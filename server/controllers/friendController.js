import dotenv from 'dotenv';
import { getFriendsBusiness, postFriendRequestBusiness, setFriendRequestBusiness, getFriendRequestsBusiness } from '../business/friendBusiness.js';
dotenv.config();

export async function getFriends(req, res) {
    try {
        let user_id = req.user.user_id;
        let friends = await getFriendsBusiness(user_id);
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
        let user_id = req.userId;
        let { send_id } = req.body;

        postFriendRequestBusiness(user_id, send_id);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
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
        // Creating one didn't work. Fix this tmr.
        let { id, from_user } = req.body;
        let current_user = req.user.user_id;
        setFriendRequestBusiness("Accepted", id, from_user, current_user);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
    }
}