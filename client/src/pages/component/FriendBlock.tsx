import { useState } from 'react';
// Changes colour based on how long ago.

// 1- 1 week --> GREEN
// 1 week - 1 month --> YELLOW
// Any longer is RED

type prop = {
    name: string,
    last_seen: string
}

function FriendBlock({name, last_seen}: prop) {
    return <>
        <div className="w-40 h-1/12 ml-8 flex flex-col items-center bg-red-200">    
            <div className="text-xl underline">{name}</div>
            <div> Last Seen {last_seen} </div>
        </div>
    
    </>
}

export default FriendBlock;