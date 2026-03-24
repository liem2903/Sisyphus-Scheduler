import Anthropic from '@anthropic-ai/sdk' 
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();

const client = new Anthropic();

import { getCalenderData, getTimezoneData, createEventData, deleteFriendRepository } from '../data_access/calendarRepository.js'

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

export async function createEventBusiness(access_token, prompt, time_zone) {
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: `Today is ${DateTime.now().setZone(time_zone).toISO()} and a ${DateTime.now().setZone(time_zone).weekdayLong}. Extract the date and time from this prompt: ${prompt}. Format the date as YYYY-MM-DD and the time as 24 hour time - giving me the start and end time. If there is a time do not give me an end date and set it to null. If there is no end time, just give the start time and make the end time 2 hours from it. If there is no time, just give the date as start date and end date where end date is one day after and set the times to null. When someone says next [day] i mean the [day] of the next week - not the upcoming one. If there is no date, just give me the time and assume the date is today. If there is no date and time - just set the event as an all day event for today. If there is a range of dates, give me both the start and end date. Make sure to also give me the prompt without the date and time in it. If the response is not a valid one for example start date is after end date- then set error to be an error message that details what was wrong with the prompt. Return your response in this json format, no extra text and no markdown: "prompt: (the prompt without the date and time), start_date: (the date), end_date (end date) start_time: (the start time), end_time: (the end time), err: (error message)".`
                }
            ]            
        })

        const text = response.content[0].text;
        const event = JSON.parse(text);
        let body = parseClaudeResponse(event, time_zone); 
        await createEventData(access_token, body);      
    } catch (err) {
        throw new Error(err.message);
    }
}

export function parseClaudeResponse (event, time_zone) {
    let body = {}

    if (event.err != null) {
        throw new Error(event.error);
    }

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

    return body;
}

export async function deleteEventBusiness(access_token, deletedEvent) {
    try {   
        return await deleteFriendRepository(access_token, deletedEvent);
    } catch (err) {
        throw new Error(err.message);
    }
}