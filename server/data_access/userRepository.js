import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';

export async function getUserName(user_id) {
    try {
        let data = await pool.query(`SELECT name FROM public.users WHERE id = $1`, [user_id]);
        return data.rows[0];
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data); 
        console.log(err.message); 
    }
}

export async function getFriendCodeRepository(user_id) {
    try {
        const code = await pool.query(`SELECT friend_code FROM public.users WHERE users.id = $1`, [user_id]);
        console.log(code.rows[0]);
        
        return code.rows[0];
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data); 
        console.log(err.message);
    }
}

export async function getTimeZoneRepository(user_id) {
    try {
        const time_zone = await pool.query('SELECT time_zone FROM public.users WHERE id = $1', [user_id]);
        return time_zone.rows[0];
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data); 
        console.log(err.message);
    }
}