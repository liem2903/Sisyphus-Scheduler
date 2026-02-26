import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid'
import { useRef, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import type { busyDates } from '../../../types/types'
import { api } from '../../../interceptor/interceptor';

type Prop = {
    groupCalendarView: boolean
    openGroupCalendar: React.Dispatch<React.SetStateAction<boolean>>,
    busyDates: busyDates[],
    groupCalendarId: String[],
    startWeek: string,
    endWeek: string,
}

export function GroupCalendar({groupCalendarView, openGroupCalendar, busyDates, groupCalendarId, startWeek, endWeek}: Prop) {
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

    const handleGroupBack = async () => {
        let new_start = DateTime.fromISO(begin).minus({days: 7}).toISO() ?? ""; 
        let new_end = DateTime.fromISO(end).minus({days: 7}).toISO() ?? "";

        setBeginWeek(new_start);
        setEndWeek(new_end);

        let taken_slots = await api.get(`/friend/get-group-availabilities`, {params: {friend_ids: JSON.stringify(groupCalendarId), start_date: new_start, end_date: new_end}, withCredentials: true});
        let events = taken_slots.data.data.flatMap((b: busyDates[]) => (
            b.map((c: busyDates) => (
                {
                    start: c.start, 
                    end: c.end,
                    display: "background",
                    backgroundColor: "rgba(255, 0, 0, 0.4)",
                    overlap: false,
                }
            ))
        ));

        setDates(events);

        calendarRef.current?.getApi().prev();
    }

    const handleGroupNext = async () => {
        let new_start = DateTime.fromISO(begin).plus({days: 7}).toISO() ?? ""; 
        let new_end = DateTime.fromISO(end).plus({days: 7}).toISO() ?? "";

        setBeginWeek(new_start);
        setEndWeek(new_end)

        let taken_slots = await api.get(`/friend/get-group-availabilities`, {params: {friend_ids: JSON.stringify(groupCalendarId), start_date: new_start, end_date: new_end}, withCredentials: true});
        let events = taken_slots.data.data.flatMap((b: busyDates[]) => (
            b.map((c: busyDates) => (
                {
                    start: c.start, 
                    end: c.end,
                    display: "background",
                    backgroundColor: "rgba(255, 0, 0, 0.4)",
                    overlap: false,
                }
            ))
        ));

        setDates(events);
        calendarRef.current?.getApi().next();
    }

    return <>
        {groupCalendarView && <div className="flex justify-center items-center inset-0 absolute">
            <div className="z-1007 bg-black/50 absolute inset-0" onClick={() => openGroupCalendar(false)}> </div>
            <div className="w-[55vw] h-[40vw] z-1008 bg-violet-400 absolute">
                <FullCalendar headerToolbar={{left: "", center: "", right: "myPrev,myNext"}} firstDay={1} customButtons={{myPrev: {icon: 'chevron-left', click: () => handleGroupBack()}, myNext: {icon: 'chevron-right', click: () => handleGroupNext()}}} ref={calendarRef} height="100%" plugins={[ dayGridPlugin, timeGridPlugin ]} initialView="timeGridWeek" events={dates}/>
            </div>
        </div>}
    </>
}

export default GroupCalendar;