import Event from "../component/home_components/Event";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { api } from "../../interceptor/interceptor";
import Spinner from "../component/global_components/Spinner";
import Events from "./Events";
import FriendChecker from "../component/home_components/FriendChecker";
import Calender from "../component/home_components/Calender";
import Portal from "../component/global_components/Portal";
import type { busyDates } from "../../types/types";

type Event = {
    eventName: string,
    timeStart: string,
    duration: string
}
// Fix the view point issues. Consistent across - learn about this. 
function Home () {
    const [ events, setEvents ] = useState<Event[]>([]);
    const [ loading, setLoad ] = useState(false);
    const [ reload, setReload ] = useState(false);
    const [ calenderView, openCalender ] = useState(false);
    const [ busyDates, setBusyDates ] = useState<busyDates[]>([]);
    const [ startWeek, setStartWeek ] = useState("");
    const [ endWeek, setEndWeek ] = useState("");
    const [ calendarId, setCalendarId ] = useState("");

    useEffect(() => {
        const getAccess = async () => {
            setLoad(true);
            let res = await api.get('/auth/getCalender', {withCredentials: true});
            let calenderData = res.data.data;
            let resEvents: Event[] = []
            
            calenderData.map((data: any) => {
                let startDate = DateTime.fromISO(data.start.dateTime);
                let endDate = DateTime.fromISO(data.end.dateTime);

                let event = {
                    eventName: data.summary,
                    timeStart: startDate.toFormat("h:mma"),
                    duration: `${endDate.diff(startDate, 'hours').hours}`
                }

                resEvents.push(event);
            })

            setEvents(resEvents);
            setLoad(false);
        }

        getAccess();
    }, [reload])

    useEffect(() => {
        const set_time = async () => {
            const time_zone = await api.get('/user/get-timezone', {withCredentials: true});
            const weekStart = DateTime.now().setZone(time_zone.data.data.time_zone).startOf("week").toUTC().toISO();
            const weekEnd = DateTime.now().setZone(time_zone.data.data.time_zone).endOf("week").toUTC().toISO();

            setStartWeek(weekStart ?? "");
            setEndWeek(weekEnd ?? "");
        }

        set_time();
    }, [])

    return (
        <>  
            <Portal open={calenderView}> 
                <Calender calenderView={calenderView} openCalender={openCalender} busyDates={busyDates} calendarId={calendarId} startWeek={startWeek} endWeek={endWeek}/>
            </Portal>
             
            <div className="flex bg-[#18142c]">
                <div className="flex flex-col w-fit"> 
                    <Events reload={reload} setReload={setReload}/>
                    {
                        loading == true ? <Spinner/> : events.length == 0 ?
                            <div className="w-[78vw] text-violet-500 font-bold h-[65vh] flex justify-center items-center text-2xl">
                            No events on today 
                            </div> : 
                            <div className="flex flex-col w-full"> 
                                <div className="content-start grid grid-cols-1 w-[77vw] h-[65vh] pl-20 mt-12 gap-y-[3vh] bg-violet-300  border-2 border-violet-600 ml-19 pt-5 overflow-y-scroll no-scrollbar">
                                    {events.map((e) => (<div> <Event startTime={e.timeStart.toLowerCase()} action={e.eventName} duration={e.duration} day="Today"/> 
                                    </div>))} 
                                   
                                </div>
                            </div>
                    }
                </div>
                <FriendChecker openCalender={openCalender} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} setCalendarId={setCalendarId}/> 
            </div>
            
        </>
     )
}

export default Home;
