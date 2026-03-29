import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios'; 

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

export async function deleteFriendRepository(access_token, deletedEvent) {
    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${deletedEvent}`;
        
        await axios.delete(url, {
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