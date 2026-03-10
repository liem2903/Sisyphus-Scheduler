import { useState } from "react";

type Prop = {
    duration: string
    action: string,
    timeStart: string,
}

function Event ({action, duration, timeStart}: Prop) {
    let [ hovered, setHover ] = useState(false);
    return ( 
        <div className={["flex flex-1 items-center rounded-full pt-[1vh] pb-[1vh] pr-[1vw] bg-[#F5ECD7]/80 mr-[1vw] pl-[1vw] shadow-xl transition duration-500 border border-[#4A7C59]", hovered ? "scale-105" : ""].join(" ")} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className="ml-5 flex text-[#3B1F0E]">
                <div className="flex justify-center items-center w-28 bg-[#4A7C59] rounded-full font-semibold shadow-2xl">
                    <div className="flex flex-col items-center text-[clamp(1rem,1.25vw,2rem)]">
                        <div className="text-[#F5ECD7]"> {parseInt(timeStart) ? timeStart : "Today"} </div> 
                    </div>        
                </div>   

                <div className="ml-5 flex flex-col justify-between truncate">
                    <div className="font-bold text-[clamp(1rem,1.25vw,2rem)] text-[#3B1F0E] min-w-0"> {action} </div> 
                    <div className="font-extralight text-[clamp(1rem,1vw,2rem)] text-[#3B1F0E] min-w-0"> {parseInt(duration) ? (parseInt(duration) == 1 ? `For ${duration} hour ` : `For ${duration} hours`) : 'Whole Day'} </div>
                </div>
            </div>
        </div>
    )
}

export default Event;