import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';

export async function getFriendsData(user_id) {
    try {
        let data = await pool.query('SELECT friend_id FROM public.friendships WHERE user_id = $1', [user_id]);
        return data.rows;
    } catch (err) {
        console.log("ERROR??");
        console.log(err.message());
    }
}

export async function postFriendRequestData(user_id, code) {
    try {
        const result = await pool.query('INSERT INTO public.friend_requests (from_user, status, to_user) SELECT $1, $2, id FROM public.users WHERE friend_code = $3 and id <> $1', [user_id, "Pending", code]);

        if (result.rowCount === 0) {
            return new Error("Code not valid");
        }

        console.log(result);
    } catch (err) {
        console.log(err.message);
    }
}

export async function setFriendRequestData(status, id) {
    try {
        pool.query(`UPDATE public.friend_requests SET status = $1 WHERE id = $2`, [status, id]);
    } catch (err) {
        console.log(err.message());
    }
}

export async function getFriendRequestsData(user_id) {
    try {       
        let data = await pool.query(`SELECT * FROM public.friend_requests WHERE to_user = $1 AND status = $2`, [user_id, "Pending"]);

        return data.rows;
    } catch (err) {
        console.log(err.message());
    }
}

export async function deleteFriendRequestData(id) {
    try {
        await pool.query(`DELETE FROM public.friend_requests WHERE id = $1`, [id]);
    } catch (err) {
        console.log(err.message());
    }
}

export async function createFriend(friend_id, id) {
    try {
        await pool.query(`INSERT INTO public.friendships (user_id, friend_id) VALUES ($1, $2)`, [id, friend_id]);
    } catch (err) {
        console.log(err);
    }
}

export async function isFriendedData(user_id, code) {
    try {
        let friend_id = (await pool.query(`SELECT id FROM public.users WHERE friend_code = $1`, [code]));
        console.log(friend_id.rows[0].id);

        // Checks if friend request exists as accepted or pending.
        let checkRequest = await pool.query(`SELECT * FROM public.friend_requests WHERE (status = $1 OR status = $2) AND from_user = $3 AND to_user = $4`, ["Accepted", "Pending", user_id, friend_id.rows[0].id])

        if (checkRequest.rowCount > 0) {
            return {
                exists: true,
                message: "Already sent (or already friends)."
            };
        } else {
            return false;
        }
    } catch (err) {

    }
}