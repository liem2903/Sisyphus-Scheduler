import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { checkRefreshToken } from "../data_access/authRepository.js";
dotenv.config();

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
            return res.status(401).json({error: 'Expired token'});
        } else {
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

// To do - check user first and then do the refresh stuff.