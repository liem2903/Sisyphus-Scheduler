import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios'; 
import pool from '../data.js';
export async function getGoogleTokenData (code) {
    try {
        const params = new URLSearchParams({
        code, 
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5173/loading',
        grant_type: 'authorization_code',});

        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',   
            params.toString(),    
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        return tokenRes.data; 
    } catch (err) {
        console.log(err.response?.data || err.message);
    }
  
};

export async function getGoogleDataAccess(access_token) {
    try {   
        const profile = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, 
            {
                headers: {Authorization: `Bearer ${access_token}`,
            },            
        });

        return profile.data;        
    } catch (err) {
        console.log(err.message);
    }
}

export async function getUserData(google_id) {
    try {
        const { rows } = await pool.query(
            `SELECT id FROM users WHERE google_id = $1`, [google_id]
        );

        if (rows.length == 0) {
            return null;
        }

        return rows[0];     
    } catch (err) {
        console.log(err.message);
    }
}

export async function createUserData(google_id, email, name, friend_code, time_zone) {
    try {
        const result = await pool.query(
            `INSERT INTO public.users (google_id, email, name, friend_code, time_zone) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [google_id, email, name, friend_code, time_zone]
        );

        return result.rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function storeRefreshGoogleData(user_id, refresh_token) {
    try {
        const result = await pool.query(
            'INSERT INTO public.google_tokens (user_id, refresh_token) VALUES ($1, $2) RETURNING user_id', [user_id, refresh_token]
        );

        return result.rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function storeRefreshTokenData(refresh_token, user_id, expires_at) {
    try {
        await pool.query(
            `INSERT INTO public.refresh_tokens (refresh_token, user_id, expires_at) VALUES ($1, $2, $3)`, [refresh_token, user_id, expires_at]
        )
    } catch (err) {
        console.log(err.message);
    }
}

export async function checkRefreshToken(refresh_token) {
    try {
        const data = await pool.query(
            `SELECT user_id FROM public.refresh_tokens WHERE refresh_token = $1`, [refresh_token]
        )
        

        return data.rows[0].user_id;
    } catch (err) {
       return null;
    }
}

export async function rotateRefreshTokenData(refresh_token, user_id, expires_at) {
    try {
        await pool.query(
            `UPDATE public.refresh_tokens SET refresh_token = $1, expires_at = $2 WHERE user_id = $3`, [refresh_token, expires_at, user_id]
        )


    } catch (err) {
        console.log(err.message);
    }
}

export async function logoutData(refresh_token) {
    try {                
        await pool.query(
            `DELETE FROM public.refresh_tokens WHERE refresh_token = $1`, [refresh_token]
        )
    } catch (err) {
        console.log(err.message);
    }
}

export async function getRefreshToken(user_id) {
    try {
        let data = await pool.query(
            `SELECT refresh_token FROM public.google_tokens WHERE user_id = $1`, [user_id]
        )
        

        return data.rows[0].refresh_token;
    } catch (err) {
        console.log(err.message);
    }
}

export async function refreshAccessToken(refresh_token) {
    try {   
        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: refresh_token,
                grant_type: "refresh_token"
            })
        });

        const data = await res.json();

        console.log(data);
        
        return {
            access_token: data.access_token,
            expires_in: data.expires_in
        };
    } catch (err) {
        console.log(err.message);
    }
}

export async function getCalenderData(access_token, time_min, time_max) {
    try {
        const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");

        url.searchParams.set("timeMin", time_min)
        url.searchParams.set("timeMax", time_max)
        url.searchParams.set("orderBy", "startTime");
        url.searchParams.set("singleEvents", "true");
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.error?.message || err.message);
    }
}

export async function getTimezoneData(access_token) {
    try {
        const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary");
        
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        return res.data.timeZone;
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data); 
        console.log(err.message);
    }
}

export async function createEventData(access_token, body) {
    try {
        const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");

        await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data); 
        console.log(err.message);
    }
}