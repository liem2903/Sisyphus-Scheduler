type Prop = {
    startTime: string,
    action: string,
    duration: string
    day: string,
}

function Event ({startTime, action, duration, day}: Prop) {
    return ( 
        <div className="flex items-center rounded-4xl w-10/12 h-30 bg-violet-200 border-violet-300  border-2 pl-2 hover:cursor-pointer">
            <div className="flex justify-center items-center w-28 h-20 bg-[#F1EDFF] rounded-lg font-bold text-2xl">
                <div className="flex flex-col items-center">
                    <div> {parseInt(startTime) ? startTime : "Today"} </div> 
                    {parseInt(startTime) ? (<div className="text-lg font-light"> {day} </div>) : ""}
                </div>
                 
            </div>
            <div className="h-15 ml-5 flex flex-col justify-between">
                <div className="font-bold text-xl"> {action} </div> 
                <div className="font-extralight text-lg"> {parseInt(duration) ? (parseInt(duration) == 1 ? `For ${duration} hour ` : `For ${duration} hours`) : 'Whole Day'} </div>
            </div>
        </div>
    )
}

export default Event;