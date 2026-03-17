import Event from "../component/home_components/Event";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { api } from "../../interceptor/interceptor";
import Events from "./Events";
import FriendChecker from "../component/home_components/FriendChecker";
import Calendar from "../component/home_components/Calendar";
import Portal from "../component/global_components/Portal";
import type { AllDayEvents, busyDates, EventType } from "../../types/types";
import CreateGroup from "../component/home_components/CreateGroup";
import GroupCalendar from "../component/home_components/GroupCalendar";
import AddFriend from "../component/home_components/AddFriend";
import AllDayEvent from "../component/home_components/AllDayEvent";
import DailyCalendarSkeleton from "../component/skeleton_components/actual_calendar/DailyCalendarSkeleton";
import DeletePopup from "../component/home_components/deletePopup";
const hours = ["1:00AM", "2:00AM", "3:00AM", "4:00AM", "5:00AM", "6:00AM", "7:00AM", "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM","1:00PM","2:00PM","3:00PM","4:00PM","5:00PM","6:00PM","7:00PM","8:00PM","9:00PM","10:00PM","11:00PM","12:00AM"];

// Fix the view point issues. Consistent across - learn about this. 
function Home () {
    const [ events, setEvents ] = useState<EventType[]>([]);
    const [ allDayEvents, setAllDayEvents ] = useState<AllDayEvents[]>([]);
    const [ loading, setLoad ] = useState(false);
    const [ calendarView, openCalendar ] = useState(false);
    const [ groupCalendarView, openGroupCalendar ] = useState(false);
    const [ groupView, openAddGroup ] = useState(false);
    const [ addFriendsView, openAddFriends ] = useState(false);
    const [ busyDates, setBusyDates ] = useState<busyDates[]>([]);
    const [ startWeek, setStartWeek ] = useState("");
    const [ endWeek, setEndWeek ] = useState("");
    const [ calendarId, setCalendarId ] = useState("");
    const [ groupCalendarIds, setGroupCalendarIds ] = useState<string[]>([]);
    const [popup, deletePopup ] = useState(false);
    const [ deletedEvent, setDeletedEvent ] = useState("");
    const [ friendCode, getFriendCode ] = useState("");
    const [ isAllDay, setAllDay ] = useState(false);

    useEffect(() => {
        const getUserFriendCode = async () => {
            let code = await api.get(`/user/get-friend-code`, {withCredentials: true});
            getFriendCode(code.data.data.friend_code);
        }

        getUserFriendCode();
    }, [])


    useEffect(() => {
        const getAccess = async () => {
            setLoad(true);
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
            setLoad(false);
        }

        getAccess();
    }, [])

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

    const filterTime = (d: EventType, e: string) => {
        const timeStart = DateTime.fromFormat(e, "h:mma");
        const timeEnd = timeStart.plus({hours: 1})
        
        return timeStart <= DateTime.fromFormat(d.timeStart, "h:mma") && timeEnd > DateTime.fromFormat(d.timeStart, "h:mma"); 
    }

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
                <AddFriend openAddFriends={openAddFriends} code={friendCode}/>
            </Portal>

            <Portal open={popup}>
                <DeletePopup deletePopup={deletePopup} deletedEvent={deletedEvent} events={events} setEvents={setEvents} isAllDay={isAllDay} setAllDayEvents={setAllDayEvents} allDayEvents={allDayEvents}/>
            </Portal>
             
            <div className="flex bg-linear-to-b to-[#8B5E3C] from-[#ebdfc4] h-screen [filter:url(#noise)]/90">
                <div className="flex flex-col w-fit overflow-y-auto h-full"> 
                    <Events setAllDayEvents={setAllDayEvents} setEvents={setEvents}/>
                    {
                        loading == true ? <DailyCalendarSkeleton /> : 
                            <div className="flex flex-col w-full pt-[3vw]"> 
                                <div className="content-start grid grid-cols-1 w-[76vw] h-[65vh] bg-[#3B1F0E] border border-[#4A7C59] ml-[3vw] rounded-[1vw] shadow-[inset_0_4px_40px_0_rgba(0,0,0,0.3)]">
                                    <div className="top-0 flex pl-[2vw] text-[#FFF8F0] border-b-2 border-b-[#4A7C59] pt-[2vh] pb-[1vh]">
                                        <div className="border-r-2 border-r-[#4A7C59] pr-[1vw] font-bold">  All-Day </div>
                                        <div className="flex-1 flex-col  max-h-[10vh] overflow-y-scroll no-scrollbar">
                                            {allDayEvents.map((event) => <AllDayEvent eventName={event.eventName} eventId={event.id} deletePopup={deletePopup} setDeletedEvent={setDeletedEvent} setAllDay={setAllDay}/>)}
                                        </div>
                                    </div>
                                    <div className=" overflow-y-scroll no-scrollbar"> 
                                        {hours.map((e, index) => (<div className="text-[#FFF8F0]/50 border-b border-b-[#4A7C59] border-l-4  border-l-[#4A7C59]">
                                            <div className={["pt-[3vh] pb-[1vh] pl-[2vw] hover:bg-amber-50/20 flex overflow-x-scroll no-scrollbar", index % 2 == 0 ? "bg-[rgba(255,255,255,0.02)]" : ""].join(" ")}>
                                                <div className="mr-[2vw]"> {e} </div> <div className="flex flex-1 flex-col gap-[1vh]"> {events.filter(d => filterTime(d, e)).map((event) => <Event action={event.eventName} duration={event.duration} timeStart={event.timeStart} deletePopup={deletePopup} id={event.id} setDeletedEvent={setDeletedEvent} setAllDay={setAllDay}/>)} </div>
                                            </div>
                                        </div>))}
                                    </div>
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
