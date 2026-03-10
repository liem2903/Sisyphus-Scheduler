type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setValue:  React.Dispatch<React.SetStateAction<string>>,
    clickButton: React.Dispatch<React.SetStateAction<boolean>>,
    value: string,
    setAllDayEvents: React.Dispatch<React.SetStateAction<AllDayEvents[]>>,
    setEvents: React.Dispatch<React.SetStateAction<EventType[]>>
}

import type { AllDayEvents, EventType } from "../../../types/types";
import { api } from "../../../interceptor/interceptor";
import { DateTime } from "luxon";

function SearchBar({query, setQuery, clickButton, setValue, value, setAllDayEvents, setEvents}: Props) {
    const handleClick = async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key == "Enter") {
                if (value == "") {
                    clickButton(false);
                    return
                }
    
                await api.post('/auth/create-event', {value});
                setTimeout(endActions, 2000);
            }                      
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
        <input type="text" placeholder="Add your new event" className="bg-[#3B1F0E] w-[76vw] h-[10vh] rounded-[4vw] pl-[clamp(1rem,2vw,100rem)] pt-1 pb-1 focus:outline-0 text-[#FFF8F0] border border-[#4A7C59]" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => handleClick(e)}/>
    )
}

export default SearchBar;