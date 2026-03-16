import { useState } from "react";

type Prop = {
    duration: string
    action: string,
    timeStart: string,
    deletePopup: React.Dispatch<React.SetStateAction<boolean>>,
    id: string,
    setDeletedEvent: React.Dispatch<React.SetStateAction<string>>,
}

function Event ({action, duration, timeStart, deletePopup, id, setDeletedEvent}: Prop) {
    const handleClick = () => {
        setDeletedEvent(id);
        deletePopup(true);
    }   

    let [ hovered, setHover ] = useState(false);
    return ( 
        <div className="flex flex-1 items-center rounded-full pt-[1vh] pb-[1vh] pr-[1vw] bg-[#F5ECD7]/80 mr-[1vw] pl-[0.5vw] transition duration-500 shadow-[0_4px_px_0_rgba(0,0,0,0.2)] min-h-[8vh] hover:bg-[#8B3A3A]/80 hover:justify-center hover:items-center hover:cursor-pointer" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => handleClick()}>
            {hovered ? <div className=" font-bold italic"> Delete Event </div>  : <div className="ml-5 flex text-[#3B1F0E] rounded-full shadow-[0_4px_25px_0_rgba(0,0,0,0.3)] w-17/18 bg-[#4A7C59]/50">
                <div className="flex justify-center items-center bg-[#4A7C59] rounded-full pl-[1vw] pr-[1vw] font-semibold shadow-[inset_0_4px_15px_0_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col items-center text-[clamp(1rem,1.25vw,2rem)] min-w-0">
                        <div className="text-[#F5ECD7]"> {parseInt(timeStart) ? timeStart : "Today"} </div> 
                    </div>        
                </div>   

                <div className="ml-5 flex flex-col justify-between truncate">
                    <div className="font-bold text-[clamp(1rem,1.25vw,2rem)] text-[#3B1F0E] pr-[1vw]"> {action} </div> 
                    <div className="font-extralight text-[clamp(1rem,1vw,2rem)] text-[#3B1F0E] min-w-0"> {parseInt(duration) ? (parseInt(duration) == 1 ? `For ${duration} hour ` : `For ${duration} hours`) : 'Whole Day'} </div>
                </div>
            </div>}
        </div>
    )
}

export default Event;