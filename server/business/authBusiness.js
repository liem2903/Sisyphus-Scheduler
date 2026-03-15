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

import Anthropic from '@anthropic-ai/sdk' 
import { DateTime } from 'luxon';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const client = new Anthropic();

export function getGoogleToken(code) {
    return getGoogleTokenData(code);
} 

export function getGoogleData(access_token) {
    return getGoogleDataAccess(access_token);
}

export async function getUser(google_id) {
    return getUserData(google_id);
}

export async function createUser(id, email, name, time_zone) {
    let friend_code = crypto.randomBytes(6).toString("base64url").toUpperCase();
    return createUserData(id, email, name, friend_code, time_zone)
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
        console.log("Fails in getCalender BUsiness")
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

export async function createEventBusiness(access_token, prompt, time_zone) {
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: `Today is ${DateTime.now().setZone(time_zone).toISO()}. Today is a ${DateTime.now().setZone(time_zone).weekdayLong}. Extract the date and time from this prompt: ${prompt}. Format the date as YYYY-MM-DD and the time as 24 hour time - giving me the start and end time. If there is a time do not give me an end date and set it to null. If there is no end time, just give the start time and make the end time 2 hours from it. If there is no time, just give the date as start date and end date where end date is one day after and set the times to null. If there is no date, just give me the time and assume the date is today. If there is a range of dates, give me both the start and end date. Make sure to also give me the prompt without the date and time in it. If the response is not a valid one for example start date is after end date- then set error to be an error message that details what was wrong with the prompt. Return your response in this json format, no extra text and no markdown: "prompt: (the prompt without the date and time), start_date: (the date), end_date (end date) start_time: (the start time), end_time: (the end time), err: (error message)".`
                }
            ]            
        })

        const text = response.content[0].text;
        const event = JSON.parse(text);
        let body = {} 
      
        if (event.start_time) {
            const start = DateTime.fromISO(`${event.start_date}T${event.start_time}`, { zone: time_zone });
            const end = DateTime.fromISO(`${event.start_date}T${event.end_time}`, { zone: time_zone });

            body = {
                summary: event.prompt,
                start: {
                    dateTime: start.toISO(),
                    timeZone: start.zoneName
                },
                end: {
                    dateTime: end.toISO(),
                    timeZone: end.zoneName
                }
            }
        } else {
            let start = DateTime.fromISO(event.start_date).toISODate();
            let end = DateTime.fromISO(event.end_date).toISODate(); 
            
            body = {
                summary: event.prompt,
                start: {
                    date: start,
                },
                end: {
                    date: end,
                }
            }
        }

        createEventData(access_token, body);      
        return; 
    } catch (err) {
        throw new Error(err.message);
    }
}

export function getFriendCodeBusiness(user_id) {
    try {
        return getFriendCodeRepository(user_id);
    } catch (err) {
        throw new Error(err.message);
    }
}
