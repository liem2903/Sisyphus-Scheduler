import type { SetStateAction } from "react"
import { api } from "../../../interceptor/interceptor"
import type { AllDayEvents, EventType } from "../../../types/types";

type Prop = {
    deletePopup: React.Dispatch<SetStateAction<boolean>>,
    deletedEvent: string,
    setEvents: React.Dispatch<SetStateAction<EventType[]>>,
    events: EventType[],
    isAllDay: boolean,
    setAllDayEvents: React.Dispatch<SetStateAction<AllDayEvents[]>>,
    allDayEvents: AllDayEvents[],
}

export default function DeletePopup({deletePopup, deletedEvent, setEvents, events, isAllDay, allDayEvents, setAllDayEvents}: Prop) {  
    const handleClick = async () => {
        await api.delete(`auth/delete-event/${deletedEvent}`);

        if (!isAllDay) setEvents(events.filter(event => event.id !== deletedEvent));        
        else setAllDayEvents(allDayEvents.filter(event => event.id !== deletedEvent));

        deletePopup(false);
    }

    return <>
        <div className="flex justify-center items-center inset-0 absolute z-1008">
                    <div className="bg-black/50 absolute inset-0" onClick={() => deletePopup(false)}> </div>
                    <div className="w-[clamp(25rem,40vw,100rem)] z-1008 bg-[#3B1F0E] absolute flex items-center flex-col gap-[3vh] rounded-lg shadow-[inset_0_4px_5px_0_rgba(0,0,0,0.3)] pb-[1vh] pt-[1vh]">  
                        <div className="text-[#FFF8F0] pt-[1vh] italic font-bold"> Are you sure you want to delete this event? </div>   
                        <div className="flex gap-[1vw]"> 
                            <div className="bg-[#858c87] w-32 h-10 text-lg flex justify-center items-center rounded-lg shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] cursor-pointer text-white font-bold hover:scale-105 transition duration-250" onClick={() => handleClick()}> Yes </div>
                            <div className="bg-[#8B3A3A] w-32 h-10 text-lg flex justify-center items-center rounded-lg shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] cursor-pointer text-white font-bold hover:scale-105 transition duration-250" onClick={() => deletePopup(false)}>No</div>
                        </div>
                    </div>
                </div>
    </>

}