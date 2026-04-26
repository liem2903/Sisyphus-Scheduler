import Event from "../component/home_components/Event";
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { api } from "../../interceptor/interceptor";
import Events from "./Events";
import FriendChecker from "./FriendChecker";
import Calendar from "../component/home_components/Calendar";
import Portal from "../component/global_components/Portal";
import type { AllDayEvents, busyDates, EventType, friends, usedGroupInfo } from "../../types/types";
import CreateGroup from "../component/home_components/CreateGroup";
import GroupCalendar from "../component/home_components/GroupCalendar";
import AddFriend from "../component/home_components/AddFriend";
import AllDayEvent from "../component/home_components/AllDayEvent";
import DailyCalendarSkeleton from "../component/skeleton_components/actual_calendar/DailyCalendarSkeleton";
import DeletePopup from "../component/home_components/DeletePopup";
import UnaddFriend from "../component/home_components/UnaddFriend";
import DeleteGroup from "../component/home_components/DeleteGroup";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const [ unfriend, openUnfriend] = useState(false);
    const [ unfriendId, setUnfriendId] = useState("");
    const [ friendlist, setFriendList ] = useState<friends[]>([]);
    const [ deleteGroupId, setDeletedGroup ] = useState("");
    const [ openGroupDelete, setGroupDelete ] = useState(false);
    const [ groups, setGroups ] = useState<usedGroupInfo[]>([]);
    const [ deletedFriendName, setDeletedFriendName ] = useState("");
    const [ deletedGroupName, setDeletedGroupName ] = useState("");
    const [ timeMax, setTimeMax ] = useState <string | null>("");
    const [ timeMin, setTimeMin ] = useState<string | null>("");
    const [ viewingDate, setViewingDate ] = useState("");
    const [ today, setToday ] = useState<string | null>("");

    useEffect(() => {
        const getUserFriendCode = async () => {
            const code = await api.get(`/user/get-friend-code`);
            getFriendCode(code.data.data.friend_code);
        }

        getUserFriendCode();
    }, [])

    useEffect(() => {
        const getAccess = async () => {
            setLoad(true);

            if (timeMax == "" && timeMin == "") {
                return;
            }

            const res = await api.get('/calendar/getCalendar', {params: {time_min: timeMin, time_max: timeMax}});            
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
            setLoad(false);
        }

        getAccess();
    }, [timeMax, timeMin])

    useEffect(() => {
        const set_time = async () => {
            const time_zone = await api.get('/user/get-timezone');
            let time_zone_str = time_zone.data.data.time_zone
            const weekStart = DateTime.now().setZone(time_zone_str).startOf("week").toUTC().toISO();
            const weekEnd = DateTime.now().setZone(time_zone_str).endOf("week").toUTC().toISO();
        
            const localStartOfDay = DateTime.now()
            .setZone(time_zone_str)
            .startOf("day");

            const time_min = localStartOfDay.toUTC().toISO();
            const today = localStartOfDay.toUTC().toISO();

            const time_max = localStartOfDay.plus({ days: 1 }).toUTC().toISO();
            const viewing_date = localStartOfDay.toFormat("MM-dd-yyyy");

            setTimeMax(time_max);   
            setTimeMin(time_min);
            setViewingDate(viewing_date);
            setStartWeek(weekStart ?? "");
            setEndWeek(weekEnd ?? "");
            setToday(today);
        }

        set_time();
    }, [])

    const filterTime = (d: EventType, e: string) => {
        const timeStart = DateTime.fromFormat(e, "h:mma");
        const timeEnd = timeStart.plus({hours: 1})
        
        return timeStart <= DateTime.fromFormat(d.timeStart, "h:mma") && timeEnd > DateTime.fromFormat(d.timeStart, "h:mma"); 
    }

    const handleIncreaseDate = () => {
        const time_zone = DateTime.fromISO(timeMin ?? "").zoneName;
        const newTimeMin = DateTime.fromISO(timeMin ?? "").setZone(time_zone ?? "").plus({ days: 1 }).toUTC().toISO();
        const newTimeMax = DateTime.fromISO(timeMax ?? "").setZone(time_zone ?? "").plus({ days: 1 }).toUTC().toISO();
        const viewing_date = DateTime.fromISO(newTimeMin ?? "").setZone(time_zone ?? "").toFormat("MM-dd-yyyy");

        setTimeMin(newTimeMin);
        setTimeMax(newTimeMax);
        setViewingDate(viewing_date);
    }

    const handleDecreaseDate = () => {
        const time_zone = DateTime.fromISO(timeMin ?? "").zoneName;
        const newTimeMin = DateTime.fromISO(timeMin ?? "").setZone(time_zone ?? "").minus({ days: 1 }).toUTC().toISO();
        const newTimeMax = DateTime.fromISO(timeMax ?? "").setZone(time_zone ?? "").minus({ days: 1 }).toUTC().toISO();
        const viewing_date = DateTime.fromISO(newTimeMin ?? "").setZone(time_zone ?? "").toFormat("MM-dd-yyyy");

        setTimeMin(newTimeMin);
        setTimeMax(newTimeMax);
        setViewingDate(viewing_date);
    }

    const handleToday = () => {
        const time_zone = DateTime.fromISO(today ?? "").zoneName;
        const newTimeMin = DateTime.fromISO(today ?? "").setZone(time_zone ?? "").toUTC().toISO();
        const newTimeMax = DateTime.fromISO(today ?? "").setZone(time_zone ?? "").plus({ days: 1 }).toUTC().toISO();
        const viewing_date = DateTime.fromISO(newTimeMin ?? "").setZone(time_zone ?? "").toFormat("MM-dd-yyyy");

        setTimeMin(newTimeMin);
        setTimeMax(newTimeMax);
        setViewingDate(viewing_date);
    }

    return (
    <>  
        {/* All your Portals stay the same */}
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
        <Portal open={unfriend}>
            <UnaddFriend openUnfriend={openUnfriend} unfriendId={unfriendId} setFriendList={setFriendList} friendlist={friendlist} deletedFriendName={deletedFriendName}/>
        </Portal>
        <Portal open={openGroupDelete}> 
            <DeleteGroup deleteGroupId={deleteGroupId} setGroupDelete={setGroupDelete} groups={groups} setGroups={setGroups} deletedGroupName={deletedGroupName}/>
        </Portal>
         
        {/* Mobile: stack vertically. Desktop (lg): side-by-side */}
        <div className="flex flex-col lg:flex-row bg-linear-to-b to-[#8B5E3C] from-[#ebdfc4] min-h-screen [filter:url(#noise)]/90">
            <div className="flex flex-col w-full lg:w-fit lg:overflow-y-auto lg:h-full"> 
                <Events setAllDayEvents={setAllDayEvents} setEvents={setEvents}/>
                {loading == true ? <DailyCalendarSkeleton /> : 
                    <div className="flex flex-col w-full pt-4"> 
                        <div className="content-start grid grid-cols-1 w-[92vw] lg:w-[76vw] h-[70vh] lg:h-[72vh] bg-[#3B1F0E] border border-[#4A7C59] mx-auto lg:ml-[3vw] rounded-2xl lg:rounded-[1vw] overflow-hidden shadow-[inset_0_4px_40px_0_rgba(0,0,0,0.3)]">
                            <div className="grid grid-cols-3 items-center text-white font-bold bg-[#4A7C59] h-10 lg:h-[4vh] px-3 lg:px-[1vw]">
                                <div className="justify-self-start flex items-center gap-2 lg:gap-[0.6vw]">
                                    <button
                                        onClick={handleToday}
                                        className="px-3 lg:px-[0.8vw] py-1 lg:py-[0.35vh] rounded-full bg-[#5B8A63] text-white text-xs lg:text-[0.8rem] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:brightness-110 transition cursor-pointer"
                                    >
                                        Today
                                    </button>
                                    <ChevronLeft size={20} onClick={() => handleDecreaseDate()} className="cursor-pointer" />
                                </div>
                                <div className="justify-self-center text-sm lg:text-base">
                                    {viewingDate}
                                </div>
                                <div className="justify-self-end cursor-pointer">
                                    <ChevronRight size={20} onClick={() => handleIncreaseDate()}/>
                                </div>
                            </div>

                            <div className="top-0 flex pl-4 lg:pl-[2vw] text-[#FFF8F0] border-b-2 border-b-[#4A7C59] pt-3 lg:pt-[2vh] pb-2 lg:pb-[1vh]">
                                <div className="border-r-2 border-r-[#4A7C59] pr-3 lg:pr-[1vw] font-bold text-sm lg:text-base">All-Day</div>
                                <div className="flex-1 flex-col max-h-24 lg:max-h-[10vh] overflow-y-scroll no-scrollbar">
                                    {allDayEvents.map((event) => <AllDayEvent eventName={event.eventName} eventId={event.id} deletePopup={deletePopup} setDeletedEvent={setDeletedEvent} setAllDay={setAllDay}/>)}
                                </div>
                            </div>
                            <div className="overflow-y-scroll no-scrollbar"> 
                                {hours.map((e, index) => (
                                    <div key={e} className="text-[#FFF8F0]/50 border-b border-b-[#4A7C59] border-l-4 border-l-[#4A7C59]">
                                        <div className={["pt-4 lg:pt-[3vh] pb-2 lg:pb-[1vh] pl-4 lg:pl-[2vw] hover:bg-amber-50/20 flex overflow-x-scroll no-scrollbar", index % 2 == 0 ? "bg-[rgba(255,255,255,0.02)]" : ""].join(" ")}>
                                            <div className="mr-4 lg:mr-[2vw] text-xs lg:text-base whitespace-nowrap">{e}</div>
                                            <div className="flex flex-1 flex-col gap-2 lg:gap-[1vh]">
                                                {events.filter(d => filterTime(d, e)).map((event) => <Event action={event.eventName} duration={event.duration} timeStart={event.timeStart} deletePopup={deletePopup} id={event.id} setDeletedEvent={setDeletedEvent} setAllDay={setAllDay}/>)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </div>
            <FriendChecker setDeletedGroupName={setDeletedGroupName} setDeletedFriendName={setDeletedFriendName} setGroups={setGroups} groups={groups} setGroupDelete={setGroupDelete} setDeletedGroup={setDeletedGroup} setFriendList={setFriendList} friendlist={friendlist} setUnfriendId={setUnfriendId} openUnfriend={openUnfriend} openCalendar={openCalendar} openGroupCalendar={openGroupCalendar} setBusyDates={setBusyDates} startWeek={startWeek} endWeek={endWeek} setCalendarId={setCalendarId} setGroupCalendarId={setGroupCalendarIds} openAddGroup={openAddGroup} openAddFriends={openAddFriends}/> 
        </div>
    </>
     )
}

export default Home;
