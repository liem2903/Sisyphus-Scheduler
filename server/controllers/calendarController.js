import dotenv from 'dotenv';
dotenv.config();

import { getCalenderBusiness, createEventBusiness, deleteEventBusiness } from '../business/calendarBusiness.js'

export async function getCalender(req, res) {
    try {
        let access_token = req.access_token;
        let { time_min, time_max} = req.query;

        let calendar = await getCalenderBusiness(access_token, time_min, time_max);        
        return res.status(200).json({success: true, data: calendar.items})
    } catch (err) {
        return res.status(400).json({success: false})
    }
}

export async function createEvent(req, res) {
    try {
        let access_token = req.access_token;
        let time_zone = req.time_zone;
        let { value: eventText } = req.body;
        await createEventBusiness(access_token, eventText, time_zone);
        return res.status(200).json({success: true});
    } catch (err) {
        return res.status(400).json({success: false});
    }
}

export async function deleteEvent(req, res) {
    try {
        let { deletedEvent } = req.params;
        let access_token = req.access_token;
        await deleteEventBusiness(access_token, deletedEvent);
        return res.status(200).json({success: true});
    } catch (err) {
        return res.status(400).json({success: false});
    }
}