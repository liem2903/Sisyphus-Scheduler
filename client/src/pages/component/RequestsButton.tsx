type prop = {
    notifications: number,
}

import { Inbox } from "lucide-react";
import { useState } from 'react';

// I want to be able to hover over my button and then my requests will pop up. I can accept and decline requests accordingly - but once my mouse LEAVES the div then the pop up disappears. No overlap.
function RequestsButton ({notifications}: prop) { 
    const [ popUp, setPopup ] = useState(false)

    return <>
        <div className="border-2 rounded-full w-1/4 flex justify-center items-center hover:cursor-pointer hover:bg-amber-50 relative" onMouseEnter={() => setPopup(true)} onMouseLeave={() => setPopup(false)}>
            <Inbox size="15"/> 
            <div className="absolute w-[0.75vw] h-[1.5vh] rounded-full bottom-[1.2vh] left-[0.7vw] bg-red-200 flex justify-center items-center text-xs"> {notifications} </div>
            {popUp && <div className="absolute top-[1.25vw] w-[10.5vw] overflow-scroll z-100 no-scrollbar right-1 bg-[#F1EDFF] border-8 h-[20vh]"> <div className=""> </div> </div>}
        </div>      
    </>
}

export default RequestsButton;

// Today's session: 
// Create request - what it looks like.
// Connect the connection to getRequests. 
// Add notification --> how many notifications --> little curved div that pops up on the icon when request > 1 --> I would like it to disappear when I decline or accept the offer. Probs should say "NO REQUESTS HERE ADD FRIENDS"
