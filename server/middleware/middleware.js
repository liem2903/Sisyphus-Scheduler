import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { checkRefreshToken, getRefreshToken, getGoogleDataAccess, refreshAccessToken } from "../data_access/authRepository.js";
dotenv.config();

import {redis} from '../redis.js';

export function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;
    
    if (!token) {
        return res.status(401).json({error: 'Not authenticated'});
    }

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_ENCRYPTION_KEY);     
        next();
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            console.log("HELLO YOU GO IN HERE");
            return res.status(401).json({error: 'Expired token'});
        } else {
            console.log("HELLO YOU GO IN HERE NOW");
            return res.status(401).json({error: 'Invalid token'});
        }
    }
}

export async function refreshMiddleware(req, res, next) {
    const token = req.cookies.refresh_token;

    if (!token) {       
        return res.status(401).json({error: "Log out"});
    }

    const userId = await checkRefreshToken(token);

    if (!userId) {
        return res.status(401).json({error: "Invalid refresh token"});
    }
    
    req.userId = userId;             
    next();
}
// Just generate an access token and put it in res.  
export async function googleAuthMiddleware(req, res, next) {
    const user_id = req.user.user_id;
    const { expiry_time } = await redis.get(`google:access:${user_id}`);

    if (Date.now() > expiry_time) {
        const refresh_token = await getRefreshToken(user_id);
        const { access_token, expiry_time } = await refreshAccessToken(refresh_token);
        await redis.set(`google:access:${user_id}`, { access_token, expiry_time }, {ex: 60 * 60})
    } 

    const { access_token } = await redis.get(`google:access:${user_id}`);
    req.access_token = access_token;
    next();
}
// To do - check user first and then do the refresh stuff.