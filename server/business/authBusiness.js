import {
     getGoogleTokenData, 
     getGoogleDataAccess, 
     getUserData, 
     createUserData, 
     storeRefreshGoogleData, 
     storeRefreshTokenData,
     rotateRefreshTokenData,
 } from "../data_access/authRepository.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export function getGoogleToken(code) {
    return getGoogleTokenData(code);
} 

export function getGoogleData(access_token) {
    return getGoogleDataAccess(access_token);
}

export async function getUser(google_id) {
    return getUserData(google_id);
}

export async function createUser(id, email, name) {
    return createUserData(id, email, name)
}

export async function storeRefreshGoogle(user_id, google_token) {
    return storeRefreshGoogleData(user_id, google_token);
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
        throw new Error(err.message());
    }
}

export async function rotateRefreshToken(refresh_token, user_id, expires_at) {
    try {
        return rotateRefreshTokenData(refresh_token, user_id, expires_at);
    } catch (err) {
        throw new Error(err.message()); 
    }
}

export async function createAccessTokenBusiness(user_id) {
    const user = {user_id};
    return jwt.sign(user, process.env.ACCESS_TOKEN_ENCRYPTION_KEY, {expiresIn: "15m",});
}
