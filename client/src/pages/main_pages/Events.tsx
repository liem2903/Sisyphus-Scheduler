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
        setTimeout(endActions, 2000);
    }

    const endActions = async () => {
        setValue("");
        clickButton(false);
        let res = await api.get('/auth/getCalendar', {withCredentials: true});
        let CalendarData = res.data.data;
        let resEvents: EventType[] = []
        let allDayEvents: AllDayEvents[] = []
        
        CalendarData.map((data: any) => {
            let startDate = DateTime.fromISO(data.start.dateTime);
            let endDate = DateTime.fromISO(data.end.dateTime);

            startDate.minute

            let newEvent: EventType = {
                eventName: data.summary,
                timeStart: startDate.toFormat("h:mma"),
                duration: `${endDate.diff(startDate, 'hours').hours}`,                    
            }

            if (!parseInt(newEvent.duration)) {
                allDayEvents.push({eventName: data.summary})
            } else {
                resEvents.push(newEvent);
            }
        })
        
        setAllDayEvents(allDayEvents);
        setEvents(resEvents);
    }

    return (
        <div className="flex items-center ml-[3vw] pt-[5vh]">
            <div className="relative flex justify-center items-center">
                <SearchBar query={value} setQuery={setValue} value={value} setValue={setValue} clickButton={clickButton} setAllDayEvents={setAllDayEvents} setEvents={setEvents}></SearchBar>
                <button className={["rounded-[4vw] bg-[#4A7C59] border-[#181528] h-3/5 absolute right-1/40 text-[#FFF8F0] font-bold text-[clamp(1rem,1vw,7rem)] w-[clamp(3rem,5vw,10rem)] shadow-2xl", clicked ? "bg-violet-400/30 text-[#3B1F0E]/30" : " hover:ring-2 hover:ring-[#E8622A]/40 hover:ring-offset-2 hover:ring-offset-black/40 transition duration-200 hover:cursor-pointer" ].join(" ")} disabled={clicked} onClick={() => {clickButton(true); handleClick()}}> <div className=''> Enter </div> </button>
            </div>
        </div>
    ) 

}

export default Events;