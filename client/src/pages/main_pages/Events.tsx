import { useState } from 'react';
import SearchBar from '../component/home_components/SearchBar';
import { api } from '../../interceptor/interceptor';
import type { AllDayEvents, EventType } from '../../types/types';
import { DateTime } from 'luxon';

type prop = {
    setAllDayEvents: React.Dispatch<React.SetStateAction<AllDayEvents[]>>,
    setEvents: React.Dispatch<React.SetStateAction<EventType[]>> 
}

function Events({setAllDayEvents, setEvents}: prop) {
    const [ value, setValue ] = useState("");
    const [ clicked, clickButton ] = useState(false);

    const handleClick = async () => {
        if (value == "") {
            clickButton(false);
            return
        }

        await api.post('/auth/create-event', {value});
        await endActions();
    }

    const endActions = async () => {
        setValue("");
        clickButton(false);
        const res = await api.get('/auth/getCalendar', {withCredentials: true});
        const CalendarData = res.data.data;
        const resEvents: EventType[] = []
        const allDayEvents: AllDayEvents[] = []
        
        CalendarData.map((data: any) => {
            const startDate = DateTime.fromISO(data.start.dateTime);
            const endDate = DateTime.fromISO(data.end.dateTime);

            const newEvent: EventType = {
                eventName: data.summary,
                timeStart: startDate.toFormat("h:mma"),
                duration: `${endDate.diff(startDate, 'hours').hours}`,     
                id: data.id,               
            }

            if (!parseInt(newEvent.duration)) {
                allDayEvents.push({eventName: data.summary, id: data.id})
            } else {
                resEvents.push(newEvent);
            }
        })
        
        setAllDayEvents(allDayEvents);
        setEvents(resEvents);
    }

    return (
        <div className="flex items-center ml-[3vw] pt-[5vh]">
            <div className="relative flex justify-center items-center rounded-[4vw] overflow-x-hidden">
                <SearchBar query={value} setQuery={setValue} value={value} setValue={setValue} clickButton={clickButton} setAllDayEvents={setAllDayEvents} setEvents={setEvents}></SearchBar>
            <button className={["rounded-[4vw] bg-[#4A7C59] border-[#181528] h-3/5 absolute right-1/40 text-[#FFF8F0] font-bold text-[clamp(0.8rem,1vw,7rem)] w-[clamp(3rem,5vw,10rem)] shadow-[0_4px_40px_0_rgba(0,0,0,0.4)]", clicked ? "text-[#3B1F0E]/30" : " hover:ring hover:scale-110 hover:ring-[#4A7C59]/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer" ].join(" ")} disabled={clicked} onClick={() => {clickButton(true); handleClick()}}> <div className=''> {clicked ? <div className="animate-pulse"> Creating event... </div> : "Enter"} </div> </button>
            </div>
        </div>
    ) 

}

export default Events;