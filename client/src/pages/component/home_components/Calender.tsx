import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid'
import { useRef, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import type { busyDates } from '../../../types/types'
import { api } from '../../../interceptor/interceptor';

type Prop = {
    calenderView: boolean
    openCalender: React.Dispatch<React.SetStateAction<boolean>>,
    busyDates: busyDates[],
    calendarId: String,
    startWeek: string,
    endWeek: string,
}

export function Calender({calenderView, openCalender, busyDates, calendarId, startWeek, endWeek}: Prop) {
    const [ begin, setBeginWeek ] = useState("");
    const [ end, setEndWeek ] = useState("");
    const [ dates, setDates ] = useState<busyDates[]>([]);

    useEffect(() => {
    const get_dates = async () => {
        setBeginWeek(startWeek);
        setEndWeek(endWeek);
        setDates(busyDates);
    }

    get_dates();
}, [])

    const calendarRef = useRef<FullCalendar | null>(null);

    const handleBack = async () => {
        let new_start = DateTime.fromISO(begin).minus({days: 7}).toISO() ?? ""; 
        let new_end = DateTime.fromISO(end).minus({days: 7}).toISO() ?? "";

        setBeginWeek(new_start);
        setEndWeek(new_end)

        let taken_slots = await api.get(`/friend/get-availabilities`, {params: {friend_id: calendarId, start_date: new_start, end_date: new_end}, withCredentials: true});
                
        const events = taken_slots.data.data.map((b: busyDates) => ({
            start: b.start,
            end: b.end,
            display: "background",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            overlap: false,
        }));

        setDates(events);

        calendarRef.current?.getApi().prev();
    }

    const handleNext = async () => {
        let new_start = DateTime.fromISO(begin).plus({days: 7}).toISO() ?? ""; 
        let new_end = DateTime.fromISO(end).plus({days: 7}).toISO() ?? "";

        setBeginWeek(new_start);
        setEndWeek(new_end)

        let taken_slots = await api.get(`/friend/get-availabilities`, {params: {friend_id: calendarId, start_date: new_start, end_date: new_end}, withCredentials: true});
                
        const events = taken_slots.data.data.map((b: busyDates) => ({
            start: b.start,
            end: b.end,
            display: "background",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            overlap: false,
        }));

        setDates(events);
        calendarRef.current?.getApi().next();
    }

    return <>
        {calenderView && <div className="flex justify-center items-center inset-0 absolute">
            <div className="z-999 bg-black/50 absolute inset-0" onClick={() => openCalender(false)}> </div>
            <div className="w-[55vw] h-[40vw] z-1000 bg-violet-400 absolute">
                <FullCalendar headerToolbar={{left: "", center: "", right: "myPrev,myNext"}} firstDay={1} customButtons={{myPrev: {icon: 'chevron-left', click: () => handleBack()}, myNext: {icon: 'chevron-right', click: () => handleNext()}}} ref={calendarRef} height="100%" plugins={[ dayGridPlugin, timeGridPlugin ]} initialView="timeGridWeek" events={dates}/>
            </div>
        </div>}
    </>
}

export default Calender