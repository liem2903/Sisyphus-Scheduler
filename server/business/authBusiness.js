import {
     getGoogleTokenData, 
     getGoogleDataAccess, 
     getUserData, 
     createUserData, 
     storeRefreshGoogleData, 
     storeRefreshTokenData,
     rotateRefreshTokenData,
     logoutData,
     getCalenderData,
     getTimezoneData,
     createEventData
 } from "../data_access/authRepository.js";

import { DateTime } from 'luxon';
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
    console.log("CREATE REFRESH TOKEN");
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

export async function logoutBusiness(refresh_token) {
    try {
        return logoutData(refresh_token);
    } catch (err) {
        throw new Error(err.message());
    }
}

export async function getCalenderBusiness(access_token, time_zone) {
    try {
        const time_min = DateTime.now().setZone(time_zone).startOf("day").toUTC().toISO();
        const time_max = DateTime.now().setZone(time_zone).plus({days: 1}).startOf("day").toUTC().toISO();

        return getCalenderData(access_token, time_min, time_max);
    } catch (err) {
        throw new Error(err.message());
    }
}

export async function getTimezoneBusiness(access_token) {
    try {
        return getTimezoneData(access_token)
    } catch (err) {
        throw new Error(err.message());
    }
}

export async function createEventBusiness(access_token, prompt) {
    try {
        const tmrRegex = /(tmr+|tomorrow+|tomorow+|tmrw|2mr)/i
        // Add time regex - make it so that it's good.
        const timeRegex = /^((0?[1-9]|1[0-2])(:)?[0-5][0-9](pm|am)?-(0?[1-9]|1[0-2])(:)?[0-5][0-9](pm|am))$/i
        const tomorrow = prompt.toLowerCase().trim().match(tmrRegex);
        const timeStart = prompt.trim().match(timeStartRegex);

        console.log(timeStart[0]);

        // If tomorrow is true then add one to both start day and end day.
        if (tomorrow) {
            prompt = prompt.toLowerCase().replace(tmrRegex, "").trim();
        }

        // Getting date and time as well.

        console.log(prompt);
 
        return 
        createEventData(access_token, prompt);
    } catch (err) {
        throw new Error(err.message);
    }
}