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
    return jwt.sign(user, process.env.ACCESS_TOKEN_ENCRYPTION_KEY, {expiresIn: "1m",});
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
        console.log("ENTERS BUSINES");
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
        const dateRegex = /(3[0-1]|2[0-9]|1[0-9]|0?[1-9])[\/]?(1[0-2]|0?[1-9])[\/]?((?:20)?[2-9][0-9])(-(3[0-1]|2[0-9]|1[0-9]|0?[1-9])[\/]?(1[0-2]|0?[1-9])[\/]?((?:20)?[2-9][0-9]))?/i;
        const date = prompt.toLowerCase().trim().match(dateRegex);

        let year = DateTime.now().setZone(time_zone).year;
        let month = DateTime.now().setZone(time_zone).month;
        let day = DateTime.now().setZone(time_zone).day;
        let daySpan = 1;
        [day, month, year] = formatDate(day, month, year);

        if (date) {
            [day, month, year] = formatDate(date[1], date[2], date[3]);

            if (date[4]) {
                let [ endDay, endMonth, endYear ] = formatDate(date[5], date[6], date[7]);

                const tempStart = DateTime.fromObject({day, month, year}, {timeZone: time_zone});
                const tempEnd = DateTime.fromObject({day: endDay, month: endMonth, year: endYear}, {timeZone: time_zone});
                daySpan = tempEnd.diff(tempStart, 'days').as('days') + 1;
            }
 
            prompt = prompt.toLowerCase().replace(dateRegex, "").trim().replace("  ", " ");
        } else {
            const tmrRegex = /(tmr+|tomorrow+|tomorow+|tmrw|2mr)/i
            const tomorrow = prompt.toLowerCase().trim().match(tmrRegex);

        // Get date somehow.
            if (tomorrow) {
                day = DateTime.now().plus({days: 1}).day;

                [day, month, year] = formatDate(day, month, year)
                prompt = prompt.toLowerCase().replace(tmrRegex, "").trim().replace("  ", " ");
            }
        }

        // Add time regex - make it so that it's good.
        const timeRegex = /(1[0-2]|0?[1-9]):?([0-5][0-9])?(pm|am)?-(1[0-2]|0?[1-9]):?([0-5][0-9])?(pm|am)?/i
        const timeStart = prompt.trim().match(timeRegex);
        
        if (timeStart) { 
            let hourStart = timeStart[1];
            let minStart = timeStart[2] ? timeStart[2]: "00";
            let hourEnd = timeStart[4];
            let minEnd = timeStart[5] ? timeStart[5]: "00";

            // So if I see that timeStart has a pm - I add 12 hours to it UNLESS it's a 12 then I leave it.
            if (timeStart[3] == "pm" && parseInt(hourStart) != 12) {
                hourStart = (setMeredian(parseInt(hourStart))).toString();
                
                if (!timeStart[6] && parseInt(hourEnd) + parseInt(minEnd) < parseInt(timeStart[1]) + parseInt(minStart) < 12) {
                    hourEnd = setMeredian(parseInt(hourEnd)).toString();
                }
            }
            // If I see that time end has a pm I add 12 hours to it unless its a 12.
            if (timeStart[6] == "pm" && hourEnd != "12") {
                if (!timeStart[3] && parseInt(hourStart) + parseInt(minStart) < parseInt(hourEnd) + parseInt(minEnd)) {
                    hourStart = (setMeredian(parseInt(hourStart))).toString();
                }

                hourEnd = setMeredian(parseInt(hourEnd)).toString();
                // If time start doens't have any meredian and it's not equal to 12 I add 12
            }

            prompt = prompt.toLowerCase().replace(timeRegex, "").trim().replace("  ", " ");
            let start = DateTime.fromObject({day, year, month, hour: hourStart, minute: minStart}, {zone: time_zone});

            if (daySpan > 1) {
                day = (parseInt(day) + daySpan).toString();
            }
             let end = DateTime.fromObject({day, year, month, hour: hourEnd, minute: minEnd}, {zone: time_zone});

            let body = {
                summary: prompt,
                start: {
                    dateTime: start.toISO(),
                    timeZone: start.zoneName
                }, 
                end: {
                    dateTime: end.toISO(),
                    timeZone: start.zoneName
                }
            };

            createEventData(access_token, body, prompt.trim());
        } else {
            // No time means I just make it a whole day thing.
            let date = `${year}-${month}-${day}`;
            let start = DateTime.fromISO(date).toISODate();
            let end = DateTime.fromISO(date).plus({days: daySpan}).toISODate(); 

            let body = {
                summary: prompt,
                start: {
                    date: start,
                }, 
                end: {
                    date: end,
                }
            };

            createEventData(access_token, body, prompt.trim());
        }
        return 
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

function setMeredian(time) {
    return time + 12; 
}

function formatDate(day, month, year) {
    day = formatMonthAndDay(day);
    month = formatMonthAndDay(month);
    year = formatYear(year);

    return [day, month, year];
}

function formatMonthAndDay(time) {
    if (time.toString().length == 1) {
        return `0${time}`;
    } 

    return time;
}

function formatYear(year) {
    if (year.toString().length == 2) {
        year = `20${year}`;
    }

    return year;
}

 
