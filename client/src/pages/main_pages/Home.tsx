import Event from "../component/home_components/Event";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { api } from "../../interceptor/interceptor";
import Spinner from "../component/global_components/Spinner";
import Events from "./Events";
import FriendChecker from "../component/home_components/FriendChecker";
import Calendar from "../component/home_components/Calendar";
import Portal from "../component/global_components/Portal";
import type { busyDates } from "../../types/types";
import CreateGroup from "../component/home_components/CreateGroup";
import GroupCalendar from "../component/home_components/GroupCalendar";
import AddFriend from "../component/home_components/AddFriend";

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
    const [ calendarView, openCalendar ] = useState(false);
    const [ groupCalendarView, openGroupCalendar ] = useState(false);
    const [ groupView, openAddGroup ] = useState(false);
    const [ addFriendsView, openAddFriends ] = useState(false);
    const [ busyDates, setBusyDates ] = useState<busyDates[]>([]);
    const [ startWeek, setStartWeek ] = useState("");
    const [ endWeek, setEndWeek ] = useState("");
    const [ calendarId, setCalendarId ] = useState("");
    const [ groupCalendarIds, setGroupCalendarIds ] = useState<string[]>([]);

    useEffect(() => {
        const getAccess = async () => {
            setLoad(true);
            let res = await api.get('/auth/getCalendar', {withCredentials: true});
            let CalendarData = res.data.data;
            let resEvents: Event[] = []
            
            CalendarData.map((data: any) => {
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
            <Portal open={calendarView}> 
                <Calendar calendarView={calendarView} openCalendar={openCalendar} busyDates={busyDates} calendarId={calendarId} startWeek={startWeek} endWeek={endWeek}/>
            </Portal>

            <Portal open={groupCalendarView}> 
                <GroupCalendar groupCalendarView={groupCalendarView} openGroupCalendar={openGroupCalendar} busyDates={busyDates} groupCalendarId={groupCalendarIds} startWeek={startWeek} endWeek={endWeek}/>
            </Portal>

            <Portal open={groupView}>
                <CreateGroup openAddGroup={openAddGroup}/>
            </Portal>

            <Portal open={addFriendsView}>
                <AddFriend openAddFriends={openAddFriends}/>
            </Portal>
             
            <div className="flex bg-[#18142c]">
                <div className="flex flex-col w-fit"> 
                    <Events reload={reload} setReload={setReload}/>
                    {
                        loading == true ? <Spinner/> : events.length == 0 ?
                            <div className="w-[75vw] text-violet-500 font-bold h-[65vh] flex justify-center items-center text-2xl">
                            No events on today 
                            </div> : 
                            <div className="flex flex-col w-full"> 
                                <div className="content-start grid grid-cols-1 w-[75vw] h-[65vh] pl-[4vw] mt-[3vw] gap-y-[3vh] bg-violet-300 border-2 border-violet-600 ml-[3vw] pt-5 overflow-y-scroll no-scrollbar">
                                    {events.map((e) => (<div> <Event startTime={e.timeStart.toLowerCase()} action={e.eventName} duration={e.duration} day="Today"/> 
                                    </div>))} 
                                   
                                </div>
                            </div>
                    }
                </div>
                <FriendChecker openCalendar={openCalendar} openGroupCalendar={openGroupCalendar} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} setCalendarId={setCalendarId} setGroupCalendarId={setGroupCalendarIds} openAddGroup={openAddGroup} openAddFriends={openAddFriends}/> 
            </div>
            
        </>
     )
}

export default Home;
