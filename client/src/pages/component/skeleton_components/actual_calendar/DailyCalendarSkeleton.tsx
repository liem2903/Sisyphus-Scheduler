import AllDayEventSkeleton from "./AllDayEventSkeleton";
import EventSkeleton from "./EventSkeleton";

export default function DailyCalendarSkeleton() {

    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const allDayEvents = [{eventName: "Event 3"}];
    return <>
        <div className="flex flex-col w-full pt-[3vw] animate-pulse"> 
            <div className="content-start grid grid-cols-1 w-[76vw] h-[65vh] bg-[#3B1F0E]  border border-[#4A7C59] ml-[3vw] rounded-[1vw]">
                <div className="top-0 flex pl-[2vw] text-[#FFF8F0] border-b-2 border-b-[#4A7C59] pt-[2vh] pb-[1vh]">
                    <div className="border-r-2 border-r-[#4A7C59] pr-[1vw] font-bold">  All-Day </div>
                    <div className="flex-1 flex-col">
                        {allDayEvents.map((event) => <AllDayEventSkeleton eventName={event.eventName}/>)}
                    </div>
                </div>
                <div className="overflow-y-scroll no-scrollbar"> 
                    {hours.map((e, index) => (<div className="text-[#FFF8F0]/50 border-b border-b-[#4A7C59] border-l-4  border-l-[#4A7C59]">
                        <div className={["pt-[3vh] pb-[1vh] pl-[2vw] flex overflow-x-scroll no-scrollbar", index % 2 == 0 ? "bg-[rgba(255,255,255,0.02)]" : ""].join(" ")}>
                            <div className="mr-[2vw]"> {e} </div> <div className="flex flex-1"> {index == 2 || index == 4 || index == 6 ? <EventSkeleton /> : null} </div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
    </>
}