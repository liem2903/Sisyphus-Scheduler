// Changes colour based on how long ago.
import { useState } from 'react';
import FlipButton from './FlipButton';

// 1- 1 week --> GREEN
// 1 week - 1 month --> YELLOW
// Any longer is RED

type prop = {
    name: string,
    last_seen: string
}

function FriendBlock({name, last_seen}: prop) {
    const [ flipped, flipOver ] = useState(false);

    return <>
        {!flipped ? (
            <div className="w-4/5 h-1/11 ml-5 mr-5 flex flex-col items-center bg-[#F1EDFF] border-2 relative rotate-y-0">   
                <div className="flex justify-center items-center"> 
                    <FlipButton flipped={flipped} flipOver={flipOver}/>
                    <div className="text-xl">
                        {name}
                    </div>  
                    <div className="bg-red-500 min-w-[1.25vw] min-h-[2.5vh] rounded-full border-red-200 border-2 absolute right-1 top-0.5"/> 
                </div>
                <div>
                    Last Seen {last_seen} 
                </div>
            </div>) :
            <div className="w-4/5 h-1/11 ml-5 mr-5 flex flex-col items-center bg-[#F1EDFF] border-2 relative rotate-y-180"> 
               <div className="flex justify-center items-center"> 
                    <FlipButton flipped={flipped} flipOver={flipOver}/>
                    YO GABBA GABBA
                </div>
            </div>
        }
    </>
}

export default FriendBlock;