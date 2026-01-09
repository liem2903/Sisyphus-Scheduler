import dotenv from 'dotenv';
import { getFriendsBusiness, postFriendRequestBusiness, setFriendRequestBusiness } from '../business/friendBusiness.js';
dotenv.config();

export async function getFriends(req, res) {
    try {
        let user_id = req.userId;
        let friends = await getFriendsBusiness(user_id);
        res.status(200).json({status: true, data: friends})
    } catch (err) {
        res.status(400).json({status: false});
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
        let user_id = req.userId;
        let { send_id } = req.body;

        setFriendRequestBusiness("Decline", user_id, send_id);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        let user_id = req.userId;
        let { send_id } = req.body;

        setFriendRequestBusiness("Accept", user_id, send_id);
        res.status(200).json({status: true})
    } catch (err) {
        res.status(400).json({status: false})
    }
}