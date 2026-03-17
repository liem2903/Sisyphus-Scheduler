import { useState, type SetStateAction } from "react";

type Prop = {
    eventName: string,
    eventId: string,
    deletePopup: React.Dispatch<SetStateAction<boolean>>,
    setDeletedEvent: React.Dispatch<React.SetStateAction<string>>,
    setAllDay: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function AllDayEvent({eventName, eventId, deletePopup, setAllDay, setDeletedEvent}: Prop) {
    const [ hover, setHover ] = useState(false);

    const handleClick = () => {
        setAllDay(true);
        setDeletedEvent(eventId);
        deletePopup(true);
    }   

    return <>
        <div className="bg-[#4A7C59]/70 truncate min-w-0 rounded-full ml-[1vw] text-[#FFF8F0] pl-[1.5vw] mr-[1vw] pb-[1vh] pt-[1vh] mb-[1vh] duration-500 transition shadow-[0_4px_40px_0_rgba(0,0,0,0.3)] hover:bg-[#8B3A3A]/80 hover:justify-center hover:items-center hover:cursor-pointer" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => handleClick()}>
            {hover ? <div className="font-bold italic w-17/18 flex justify-center"> Delete Event </div>  : `${eventName}`} 
        </div>
    </>
}