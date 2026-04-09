import {
     getGoogleTokenData, 
     getGoogleDataAccess, 
     getUserData, 
     createUserData, 
     storeRefreshGoogleData, 
     storeRefreshTokenData,
     rotateRefreshTokenData,
     logoutData,
     getTimezoneData
 } from "../data_access/authRepository.js";

import Anthropic from '@anthropic-ai/sdk' 
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const client = new Anthropic();

export async function getGoogleToken(code) {
    return await getGoogleTokenData(code);
} 

export async function getGoogleData(access_token) {
    return await getGoogleDataAccess(access_token);
}

export async function getUser(google_id) {
    return await getUserData(google_id);
}

export async function createUser(id, email, name, time_zone) {
    let friend_code = crypto.randomBytes(6).toString("base64url").toUpperCase();
    return await createUserData(id, email, name, friend_code, time_zone)
}

export async function storeRefreshGoogle(user_id, google_token) {
    return await storeRefreshGoogleData(user_id, google_token);
}
 
export async function createRefreshTokenLogic() {
    let code = crypto.randomBytes(64).toString("hex");
    let expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return {code, expiresAt };
}

export async function storeRefreshToken(refresh_token, user_id, expires_at) {
    try {
        return storeRefreshTokenData(refresh_token, user_id, expires_at);
    } 
    catch (err) {
        throw new Error(err.message);
    }
}

export async function rotateRefreshToken(refresh_token, user_id, expires_at) {
    try {
        return await rotateRefreshTokenData(refresh_token, user_id, expires_at);
    } catch (err) {
        throw new Error(err.message); 
    }
}

export async function createAccessTokenBusiness(user_id) {
    const user = {user_id};
    return jwt.sign(user, process.env.ACCESS_TOKEN_ENCRYPTION_KEY, {expiresIn: "15m",});
}

export async function logoutBusiness(user_id) {
    try {
        return await logoutData(user_id);
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getTimezoneBusiness(access_token) {
    try {
        return await getTimezoneData(access_token)
    } catch (err) {
        throw new Error(err.message);
    }
}
