import { Inbox } from "lucide-react";
import { useState } from 'react';

// I want to be able to hover over my button and then my requests will pop up. I can accept and decline requests accordingly - but once my mouse LEAVES the div then the pop up disappears. No overlap.
function RequestsButton () { 
    const [ popUp, setPopup ] = useState(false)


    return <>
        <div className="border-2 rounded-full w-1/4 border-violet-300 flex justify-center items-center hover:cursor-pointer hover:bg-amber-50">
            <Inbox size="15"/> 
        </div>      
    </>
}

export default RequestsButton;