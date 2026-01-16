import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';

export async function getFriendsData(user_id) {
    try {
        let data = pool.query('SELECT friend_id FROM public.friendships WHERE user_id = $1', [user_id]);
        return data[0];
    } catch (err) {
        console.log(err.message());
    }
}

export async function postFriendRequestData(user_id, send_id) {
    try {
        pool.query('INSERT INTO public.friend_requests (user_id, friend_id) VALUES ($1, $2)', [user_id, send_id]);
    } catch (err) {
        console.log(err.message());
    }
}

export async function setFriendRequestData(status, user_id, send_id) {
    try {
        pool.query(`UPDATE public.friend_requests SET status = $1 WHERE user_id = $2 AND send_id = $3`, [status, user_id, send_id]);
    } catch (err) {
        console.log(err.message());
    }
}

export async function getFriendRequestsData(user_id) {
    try {       
        let data = await pool.query(`SELECT * FROM public.friend_requests WHERE to_user = $1`, [user_id]);

        return data.rows;
    } catch (err) {
        console.log(err.message());
    }
}