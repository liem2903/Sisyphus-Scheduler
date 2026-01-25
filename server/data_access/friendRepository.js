import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';
import axios from 'axios';

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
        console.log(err.message);
    }
}

export async function getFriendRequestsData(user_id) {
    try {       
        let data = await pool.query(`SELECT * FROM public.friend_requests WHERE to_user = $1 AND status = $2`, [user_id, "Pending"]);

        return data.rows;
    } catch (err) {
        console.log(err.message);
    }
}

export async function deleteFriendRequestData(id) {
    try {
        await pool.query(`DELETE FROM public.friend_requests WHERE id = $1`, [id]);
    } catch (err) {
        console.log(err.message());
    }
}

export async function createFriend(friend_id, id, friend_name) {
    try {
        await pool.query(`INSERT INTO public.friendships (user_id, friend_id, friend_name) VALUES ($1, $2, $3)`, [id, friend_id, friend_name]);
    } catch (err) {
        console.log(err);
    }
}

export async function isFriendedData(user_id, code) {
    try {
        let friend_id = (await pool.query(`SELECT id FROM public.users WHERE friend_code = $1`, [code]));

         if (friend_id.rowCount == 0) {
            return {
                exists: true,
                message: "Friend code does not exist."
            };
        } 
        // Checks if friend request exists as accepted or pending.
        let checkRequest = await pool.query(`SELECT * FROM public.friend_requests WHERE (status = $1 OR status = $2) AND from_user = $3 AND to_user = $4`, ["Accepted", "Pending", user_id, friend_id.rows[0].id]);

        if (checkRequest.rowCount > 0) {
            return {
                exists: true,
                message: "Already sent (or already friends)."
            };
        } else {
            return {exists: false};
        }
    } catch (err) {
        console.log(err.message);
    }
}

export async function getChangedUserName(user_id, friend_id) {
    try {
        let data = await pool.query(`SELECT friend_name FROM friendships WHERE user_id = $1 AND friend_id = $2`, [user_id, friend_id]);
        return data.rows[0].friend_name;
    } catch (err) {
        console.log(err.status);
        console.log(err.message);
    }
}

export async function changeFriendNameRepository(user_id, id, name) {
    try {
        await pool.query(`UPDATE public.friendships SET friend_name = $1 WHERE user_id = $2 AND friend_id = $3`, [name, user_id, id]);
    } catch (err) {
        console.log(err.message);
        console.log(err.status);
    }
}

export async function checkUniqueName(user_id, name) {
    try {
        const data = await pool.query(`SELECT * FROM public.friendships WHERE friend_name = $1 AND user_id = $2`, [name, user_id]);
        
        if (data.rowCount > 0) {
            return false;
        }
        
        return true;
    } catch (err) {
        console.log(err.message);
        console.log(err.status);
    }
}

export async function getLastSeen(name, access_token, time_max) {
    try {
        const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
        url.searchParams.set("q", name.toLowerCase());
        url.searchParams.set("timeMax", time_max);
        // url.searchParams.set("singleEvents", true);
        // url.searchParams.set("orderBy", startTime);
         
        let data = await axios.get(url.toString(), {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        const event = data.data.items[data.data.items.length - 1];
        const startStr = event?.start?.dateTime ?? event?.start?.date;
        
        if (!startStr) {
            return {
                status: false
            } 
        }

        return {status: true, start: startStr} ?? {status: false};
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data);
    }
}