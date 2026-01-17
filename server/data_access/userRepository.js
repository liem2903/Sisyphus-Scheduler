import dotenv from 'dotenv';
dotenv.config();
import pool from '../data.js';

export async function getUserName(user_id) {
    try {
        let data = await pool.query(`SELECT name FROM public.users WHERE id = $1`, [user_id]);
        return data.rows[0];
    } catch (err) {
        console.log(err.message()) 
    }
}