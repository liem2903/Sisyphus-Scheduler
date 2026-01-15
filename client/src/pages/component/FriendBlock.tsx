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
        <div className="w-4/5 h-1/11 ml-5 mr-5 flex flex-col items-center bg-[#F1EDFF] border-2 relative">    
            <div className="flex justify-center items-center"> <div className="text-xl"> {name} </div>  <div className="bg-red-500 min-w-[1.25vw] min-h-[2.5vh] rounded-full border-red-200 border-2 absolute left-[9.75vw]"></div> </div>
            <div> Last Seen {last_seen} </div>
        </div>
    
    </>
}

export default FriendBlock;