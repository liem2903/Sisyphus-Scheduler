import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';

export function getFriendsData(user_id) {
    try {
        let data = pool.query('SELECT friend_id FROM public.friendships WHERE user_id = $1', [user_id]);
        return data[0];
    } catch (err) {
        console.log(err.message());
    }
}

export function postFriendRequestData(user_id, send_id) {
    try {
        pool.query('INSERT INTO public.friendships (user_id, friend_id) VALUES ($1, $2)', [user_id, send_id]);
    } catch (err) {
        console.log(err.message());
    }
}

export function setFriendRequestData(status, user_id, send_id) {
    try {
        pool.query(`UPDATE public.friend SET status = $1 WHERE user_id = $2 AND send_id = $3`, [status, user_id, send_id]);
    } catch (err) {
        console.log(err.message());
    }
}